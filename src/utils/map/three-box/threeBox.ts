import { IThreeboxOptions } from "@/models/map/three-box/three-box";
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

export class ThreeBox {
  private map: Map;
  private gl: WebGLRenderingContext;
  private options: IThreeboxOptions;
  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private world!: Group;
  private cameraSync!: CameraSync;
  private raycaster!: Raycaster;
  constructor(map: Map, gl: WebGLRenderingContext, options?: IThreeboxOptions) {
    this.map = map;
    this.gl = gl;
    this.options = options || defaultOptions;
    this.init();
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
    this.cameraSync = new CameraSync(this.map, this.camera, this.world);
    //raycaster for mouse events
    this.raycaster = new Raycaster();

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

  objects() {}
}
