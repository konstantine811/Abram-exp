import {
  ISphereObjectOptions,
  IThreeboxOptions,
} from "@/models/map/three-box/three-box";
import { Map } from "mapbox-gl";
import {
  AmbientLight,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Raycaster,
  Scene,
  WebGLRenderer,
} from "three";
import { CameraSync } from "./camera/cameraSync";
import { defaultOptions } from "./utils/config";
import { AnimationManager } from "./animation/animationManager";
import { Sphere } from "./objects/sphere";

export class ThreeBox {
  private map: Map;
  private gl: WebGLRenderingContext;
  private options: IThreeboxOptions;
  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private world!: Group;
  private _cameraSync!: CameraSync;
  private _raycaster!: Raycaster;
  private _animationManager!: AnimationManager;
  constructor(map: Map, gl: WebGLRenderingContext, options?: IThreeboxOptions) {
    this.map = map;
    this.gl = gl;
    this.options = options || defaultOptions;
    this.init();
  }

  get cameraSync() {
    return this._cameraSync;
  }

  get raycaster() {
    return this._raycaster;
  }

  private init() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.map.getCanvas(),
      context: this.gl,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.autoClear = false;

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      28,
      window.innerWidth / window.innerHeight,
      0.000000000001,
      Infinity
    );

    // The CameraSync object will keep the Mapbox and THREE.js camera movements in sync.
    // It requires a world group to scale as we zoom in. Rotation is handled in the camera's
    // projection matrix itself (as is field of view and near/far clipping)
    // It automatically registers to listen for move events on the map so we don't need to do that here
    this.world = new Group();
    this.scene.add(this.world);
    this._cameraSync = new CameraSync(this.map, this.camera, this.world);
    //raycaster for mouse events
    this._raycaster = new Raycaster();
    this._animationManager = AnimationManager.getInstance(this.map);
    if (this.options.defaultLights) {
      this.defaultLights();
    }
  }

  private defaultLights() {
    this.scene.add(new AmbientLight(0xffffff));
    const sunlight = new DirectionalLight(0xffffff, 0.25);
    sunlight.position.set(0, 80000000, 100000000);
    sunlight.matrixWorldNeedsUpdate = true;
    this.world.add(sunlight);
  }

  addSphere(options: ISphereObjectOptions, isStatic: boolean = false) {
    const sphere = new Sphere(
      options,
      this.world,
      this._animationManager,
      this.map,
      isStatic
    );
    return sphere;
  }

  update() {
    if (this.map && this.map.repaint) {
      this.map.repaint = false;
    }
    const timestamp = Date.now();
    // UPdate any animations
    this._animationManager.update(timestamp);
    this.renderer.state.reset();
    // Render the scene and repaint the map
    this.renderer.render(this.scene, this.camera);
    if (this.options.passiveRendering === false) {
      this.map.triggerRepaint();
    }
  }
}
