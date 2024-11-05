import { AnimationManager } from "./../animation/animationManager";
import {
  ILineObjectOptions,
  IObjectOptions,
  IObjectUntis,
  Vector3Type,
} from "@/models/map/three-box/three-box";
import { Group, Line, LineBasicMaterial, Object3D } from "three";
import {
  lnglatsToWorld,
  createBufferGeometry,
  validate,
  projectedUntisPerMeter,
  radify,
  projectToWorld,
} from "../utils/utils-transform";
import { Map } from "mapbox-gl";
import { defaultsLineOptions } from "../utils/config";

export class MapObject3D {
  private _object: Object3D;
  private _coordinates: Vector3Type = [0, 0, 0];
  private _animationManager: AnimationManager;
  private _world: Group;
  private _isStatic: boolean;
  private _map: Map;
  constructor(
    obj: Object3D,
    world: Group,
    animationManager: AnimationManager,
    map: Map,
    isStatic: boolean
  ) {
    this._object = obj;
    this._map = map;
    this._world = world;
    this._animationManager = animationManager;
    this._isStatic = isStatic;
    if (this._isStatic) {
      obj.userData.units = obj.userData.units || "meters";
    }
  }

  get coordinates(): Vector3Type {
    return this._coordinates;
  }

  get object(): Object3D {
    return this._object;
  }

  set coords(lnglat: Vector3Type) {
    if (this._object.userData.units === IObjectUntis.meters) {
      const s = projectedUntisPerMeter(lnglat[1]);
      this._object.scale.set(s, s, s);
    }
    this._coordinates = lnglat;
    console.log("lnglat", lnglat);
    const pos = projectToWorld(lnglat);
    console.log("position", pos);
    this._object.position.set(pos.x, pos.y, pos.z);
  }

  set rotation(rotation: Vector3Type) {
    const r = radify(rotation) as Vector3Type;
    this._object.rotation.set(r[0], r[1], r[2]);
  }

  add() {
    this._world.add(this._object);
    this._map.repaint = true;
  }

  remove() {
    this._world.remove(this._object);
    this._map.repaint = true;
  }

  line(options: ILineObjectOptions) {
    const obj = validate(options, defaultsLineOptions);
    // project to wolrd and normalize
    const straightProject = lnglatsToWorld(obj.geometry);
    const { geometry, position } = createBufferGeometry(straightProject);
    // flatten array for buffergeometry
    const material = new LineBasicMaterial({
      color: obj.color ? obj.color : 0xff0000,
      linewidth: obj.width ? obj.width : 21,
    });
    const line = new Line(geometry, material);
    const objectOptions: IObjectOptions = {
      duration: 1000,
      position: line.position.copy(position),
    };
    return { line, options: objectOptions };
  }

  addMethods() {
    this._animationManager.enroll(this);
  }
}
