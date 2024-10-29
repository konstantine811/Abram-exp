import { Map } from "mapbox-gl";
import { Group, Matrix4, PerspectiveCamera } from "three";
import { WORLD_CONFIG } from "../utils/config";
import { makePerspectiveMatrix } from "../utils/3d-utils";

interface CameraState {
  fov: number;
  translateCenter: Matrix4;
  worldSizeRatio: number;
  cameraToCenterDistance: number;
  cameraTranslateZ: Matrix4;
  topHalfSurfaceDistance: number;
}

export class CameraSync {
  private map: Map;
  private camera: PerspectiveCamera;
  private world: Group;
  private state: CameraState = {
    fov: 0.6435011087932844,
    translateCenter: new Matrix4().makeTranslation(
      WORLD_CONFIG.WORLD_SIZE / 2,
      -WORLD_CONFIG.WORLD_SIZE / 2,
      0
    ),
    worldSizeRatio: 512 / WORLD_CONFIG.WORLD_SIZE,
    cameraToCenterDistance: 0,
    cameraTranslateZ: new Matrix4(),
    topHalfSurfaceDistance: 0,
  };
  constructor(map: Map, camera: PerspectiveCamera, world: Group) {
    this.map = map;
    this.camera = camera;

    this.camera.matrixAutoUpdate = false; // Ми тепер самі керуємо оновленням матриці камери

    // Позиціонуємо та налаштовуємо групу world, щоб можна було масштабувати її під час масштабування карти
    this.world = world || new Group();
    this.world.position.x = this.world.position.y = WORLD_CONFIG.WORLD_SIZE / 2;
    this.world.matrixAutoUpdate = false;

    // update and setup camera
    this.map
      .on("move", this.updateCamera.bind(this))
      .on("resize", this.setupCamera.bind(this));
    this.setupCamera();
  }

  private setupCamera() {
    const t = this.map.transform;
    const halfFov = this.state.fov / 2;
    const cameraToCenterDistance = (0.5 / Math.tan(halfFov)) * t.height;
    const groundAngle = Math.PI / 2 + t._pitch;

    this.state.cameraToCenterDistance = cameraToCenterDistance;
    this.state.cameraTranslateZ = this.state.cameraTranslateZ.makeTranslation(
      0,
      0,
      cameraToCenterDistance
    );
    this.state.topHalfSurfaceDistance =
      (Math.sin(halfFov) * cameraToCenterDistance) /
      Math.sin(Math.PI - groundAngle - halfFov);
  }

  private updateCamera() {
    if (!this.camera) {
      console.error("Camera is not set");
      return;
    }
    const t = this.map.transform;
    // Визначаємо найвіддаленішу відстань до фрагмента, який повинен рендеритися
    const furthestDistance =
      Math.cos(Math.PI / 2 - t._pitch) * this.state.topHalfSurfaceDistance +
      this.state.cameraToCenterDistance;
    // Додаємо трохи, щоб уникнути проблем з точністю
    const farZ = furthestDistance * 1.01;
    // Оновлюємо матрицю проекції камери
    this.camera.projectionMatrix = makePerspectiveMatrix(
      this.state.fov,
      t.width / t.height,
      1,
      farZ
    );

    const cameraWorldMatrix = new Matrix4();
    const cameraTranslateZ = new Matrix4().makeTranslation(
      0,
      0,
      this.state.cameraToCenterDistance
    );
    this.state.cameraTranslateZ = cameraTranslateZ;
    const rotatePitch = new Matrix4().makeRotationX(t._pitch);
    const rotateBearing = new Matrix4().makeRotationZ(t.angle);

    // Розділяємо переміщення і обертання камери в матриці світового простору
    cameraWorldMatrix
      .premultiply(this.state.cameraTranslateZ)
      .premultiply(rotatePitch)
      .premultiply(rotateBearing);

    // Застосовуємо нову світову матрицю до камери
    this.camera.matrixWorld.copy(cameraWorldMatrix);

    // Обчислюємо масштаб
    const zoomPow = t.scale * this.state.worldSizeRatio;

    // Обчислюємо трансформації для світу (об'єктів на карті)
    const scale = new Matrix4();
    const translateMap = new Matrix4();
    const rotateMap = new Matrix4();

    scale.makeScale(zoomPow, zoomPow, zoomPow);

    const x = -this.map.transform.point.x;
    const y = this.map.transform.point.y;

    translateMap.makeTranslation(x, y, 0);
    rotateMap.makeRotationZ(Math.PI);

    // Оновлюємо світову матрицю
    this.world.matrix = new Matrix4();
    this.world.matrix
      .premultiply(rotateMap)
      .premultiply(this.state.translateCenter)
      .premultiply(scale)
      .premultiply(translateMap);
  }
}
