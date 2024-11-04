import {
  BufferGeometry,
  CatmullRomCurve3,
  NormalBufferAttributes,
  Vector3,
} from "three";

export interface IThreeboxOptions {
  defaultLights?: boolean;
  enableSelectingObjects?: boolean;
  enableDraggingObjects?: boolean;
  enableRotatingObjects?: boolean;
  enableTooltips?: boolean;
  enablePicking?: boolean;
  passiveRendering?: boolean;
}

export interface IObjectOptions {
  position?: Vector3;
  worldCoordinates?: Vector3;
  quaternion?: Vector4Type;
  duration: number;
  coords?: Vector3Type | Vector2Type;
  rotation?: Vector3Type;
  scale?: Vector3Type;
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
  startRoration?: Vector3Type;
  startScale?: Vector3Type;
}

export interface IObjectAnimationOptions extends IObjectOptions {
  start: number;
  expiration: number | boolean;
  rotationPerMs?: Vector3Type;
  scalePerMs?: Vector3Type;
  pathCurve?: CatmullRomCurve3;
  endState?: IObjectOptions;
}

export interface IObjectAnimationEntry {
  type: AnimationTypes;
  options:
    | IObjectOptions
    | IObjectAnimationOptions
    | IAnimationFollowPathOptions;
}

export interface IDefaultOptions {
  [key: string]: string | number | boolean | null | Vector2Type | Vector3Type;
}

export interface IAnimationFollowPathOptions extends IObjectAnimationOptions {
  path: Vector3Type[];
  duration: number;
  trackHeading: boolean;
  cb: () => void;
}

// Interface for material options
export interface IMaterialOptions {
  material?: IObjectMaterialTypes;
  color?: string | number;
  opacity?: number;
}

export interface ISphereObjectOptions extends IMaterialOptions {
  radius?: number;
  units?: IObjectUntis;
  sides?: number;
  position: Vector3Type;
}

export interface ILineObjectOptions extends IMaterialOptions {
  geometry: (Vector3Type | Vector2Type)[];
  width?: number;
}

export interface ITubeObjectOptions extends IMaterialOptions {
  geometry: (Vector3Type | Vector2Type)[];
  radius?: number;
  sides?: number;
}

export interface INormalizedVertices {
  vertices: Vector3[];
  position: Vector3;
  radius: number;
  geometry: BufferGeometry<NormalBufferAttributes>;
}

export enum IObjectMaterialTypes {
  meshBasicMaterial = "MeshBasicMaterial",
  meshLambertMaterial = "MeshLambertMaterial",
  meshPhongMaterial = "MeshPhongMaterial",
  meshStandardMaterial = "MeshStandardMaterial",
  meshPhysicalMaterial = "MeshPhysicalMaterial",
  meshMatcapMaterial = "MeshMatcapMaterial",
  meshDepthMaterial = "MeshDepthMaterial",
  meshNormalMaterial = "MeshNormalMaterial",
  meshDistanceMaterial = "MeshDistanceMaterial",
  meshFaceMaterial = "MeshFaceMaterial",
}

export enum IObjectUntis {
  meters = "meters",
  sceneUnits = "scene",
}

export enum AnimationTypes {
  SET = "set",
  FOLLOW_PATH = "followPath",
}
export type Vector4Type = [number, number, number, number];
export type Vector3Type = [number, number, number];
export type Vector2Type = [number, number];
