import {
  AnimationTypes,
  IAnimationFollowPathOptions,
  IObjectAnimationEntry,
  IObjectAnimationOptions,
  IObjectOptions,
  Vector3Type,
} from "@/models/map/three-box/three-box";
import { CatmullRomCurve3, Quaternion, Vector3 } from "three";
import {
  extend,
  lnglatsToWorld,
  projectToWorld,
  radify,
  typeScale,
  validate,
} from "../utils/utils-transform";
import { MapObject3D } from "../objects/Objects3d";
import { Map } from "mapbox-gl";

export class AnimationObject3D {
  private _mapObject: MapObject3D;
  private _map: Map;
  private _coordinates!: Vector3Type;
  private _position = new Vector3();
  private _rotation = new Vector3();
  private _scale = new Vector3();
  private _quaternion = new Quaternion();
  private _defaultFollowPath: IAnimationFollowPathOptions = {
    duration: 1000,
    trackHeading: true,
    path: [],
    pathCurve: new CatmullRomCurve3([]),
    start: 0,
    expiration: 0,
    cb: () => {},
  };
  // Встановлюємо чергу анімацій для об'єкта
  private _animationQueue: IObjectAnimationEntry[] = [];

  constructor(obj: MapObject3D, map: Map) {
    this._mapObject = obj;
    this._map = map;
  }

  get coordinates(): Vector3Type {
    return this._coordinates;
  }

  get animationQueue(): IObjectAnimationEntry[] {
    return this._animationQueue;
  }

  setOptions(options: IObjectOptions) {
    const { object } = this._mapObject;
    object.userData.animationOptions = options;
    // Якщо встановлено час тривалості, то анімуємо об'єкт до нового стану
    if (options.duration > 0) {
      // Ініціалізуємо нові параметри анімації
      const newParams: IObjectAnimationOptions = {
        start: Date.now(),
        expiration: Date.now() + options.duration,
        duration: options.duration,
        endState: {
          position: object.position.clone(),
          rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
          scale: object.scale.toArray(),
          duration: options.duration,
        },
      };
      // Перевіряємо, чи потрібно рухати, повертати чи змінювати масштаб
      const animObj = extend(options, newParams);
      const translating = options.coords;
      const rotating = options.rotation;
      const scaling: Vector3Type | number | undefined =
        options.scale || options.scaleX || options.scaleY || options.scaleZ;

      // Налаштування параметрів для обертання, якщо воно задано
      if (rotating) {
        const r = object.rotation;
        animObj.startRoration = [r.x, r.y, r.z];
        if (!animObj.endState) {
          animObj.endState = {
            duration: options.duration,
          };
        }
        animObj.endState.rotation = rotating;

        // Обчислюємо обертання за мілісекунду для кожної осі
        animObj.rotationPerMs = animObj.endState.rotation.map((r, i) => {
          if (animObj.startRoration && animObj.startRoration[i]) {
            return (r - animObj.startRoration[i]) / animObj.duration;
          }
        }) as Vector3Type;
      }

      // Налаштування параметрів для масштабу, якщо він заданий
      if (scaling) {
        const s = object.scale;
        animObj.startScale = [s.x, s.y, s.z];
        if (!animObj.endState) {
          animObj.endState = {
            duration: options.duration,
          };
        }
        animObj.endState.scale = typeScale(scaling, animObj.startScale);

        // Обчислюємо зміну масштабу за мілісекунду для кожної осі
        animObj.scalePerMs = animObj.endState.scale.map((s, i) => {
          if (animObj.startScale && animObj.startScale[i]) {
            return (s - animObj.startScale[i]) / animObj.duration;
          }
        }) as Vector3Type;
      }
      // Якщо потрібен переклад, створюємо криву руху
      if (translating && animObj.coords) {
        animObj.pathCurve = new CatmullRomCurve3(
          lnglatsToWorld([this._mapObject.coordinates, animObj.coords])
        );
      }
      const entry: IObjectAnimationEntry = {
        type: AnimationTypes.SET,
        options: animObj,
      };
      this._animationQueue.push(entry);
      this._map.repaint = true;
    }
    //if no duration set, stop object's existing animations and go to that state immediately
    else {
      this.stop();
      if (options.rotation) {
        options.rotation = radify(options.rotation) as Vector3Type;
      }
      this.setObject(options);
    }
    return this;
  }

  stop() {
    this._animationQueue = [];
    return this;
  }

  setObject(options: IObjectOptions) {
    const p = options.position; // lnglat;
    const r = options.rotation; // radians;
    const s = options.scale; // scale;
    const w = options.worldCoordinates; // world coordinates;
    const q = options.quaternion; // quaternion;

    if (p) {
      this._coordinates = [p.x, p.y, p.z];
      const c = projectToWorld(this._coordinates);
      this._position.copy(c);
    }

    if (r) {
      this._rotation.set(r[0], r[1], r[2]);
    }
    if (s) {
      this._scale.set(s[0], s[1], s[2]);
    }

    if (q) {
      this._quaternion.setFromAxisAngle(new Vector3(q[0], q[1], q[2]), q[3]);
    }

    if (w) {
      this._position.copy(w);
    }
    this._map.repaint = true;
  }

  followPath(options: IAnimationFollowPathOptions, cb: () => void) {
    const entry: IObjectAnimationEntry = {
      type: AnimationTypes.FOLLOW_PATH,
      options: validate(options, this._defaultFollowPath),
    };
    const entryOptions = entry.options as IAnimationFollowPathOptions;

    extend(entry.options, {
      pathCurve: new CatmullRomCurve3(lnglatsToWorld(entryOptions.path)),
      start: Date.now(),
      expiration: Date.now() + entryOptions.duration,
      cb,
    });
    this._animationQueue.push(entry);
    this._map.repaint = true;
    return this;
  }
}
