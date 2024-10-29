import { CatmullRomCurve3, Vector3 } from "three";

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
  position: Vector3Type;
  worldCoordinates: Vector3Type;
  quaternion: Vector4Type;
  duration: number;
  coords: Vector3Type | Vector2Type;
  rotation?: Vector3Type;
  scale?: Vector3Type;
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
  startRoration?: Vector3Type;
  startScale?: Vector3Type;
}

export interface IObjectAnimationOptions {
  start: number;
  expiration: number;
  rotationPerMs?: Vector3Type;
  scalePerMs?: Vector3Type;
  pathCurve?: CatmullRomCurve3;
  endState: IObjectAnimationEndState;
}

export interface IObjectAnimationEndState {
  position: Vector3;
  rotation: Vector3Type;
  scale: Vector3Type;
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

export interface IAnimationFollowPathOptions {
  path: Vector3Type[];
  duration: number;
  trackHeading: boolean;
  pathCurve: CatmullRomCurve3;
  start: number;
  expiration: number;
  cb: () => void;
}

export enum AnimationTypes {
  SET = "set",
  FOLLOW_PATH = "followPath",
}
export type Vector4Type = [number, number, number, number];
export type Vector3Type = [number, number, number];
export type Vector2Type = [number, number];
