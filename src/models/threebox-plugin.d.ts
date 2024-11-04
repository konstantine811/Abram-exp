// threebox-plugin.d.ts

declare module "threebox-plugin" {
  import {
    Box3Helper,
    BoxHelper,
    Euler,
    Group,
    Object3D,
    Vector3,
  } from "three";
  import { Map } from "mapbox-gl";

  interface ThreeboxOptions {
    defaultLights?: boolean;
    enableSelectingObjects?: boolean;
    enableDraggingObjects?: boolean;
    enableRotatingObjects?: boolean;
    enableTooltips?: boolean;
    enablePicking?: boolean;
  }

  interface LoadGLTFOptions extends Object3D, BoxHelper {
    obj: string;
    mtl: string;
    scale: Vector3;
    rotation: Euler;
    selected: boolean;
    translation: { x: number; y: number; z: number };
    setCoords: (coords: [number, number]) => void;
    setRotation: (rotation: { x: number; y: number; z: number }) => void;
    wireframe: boolean;
    drawBoundingBox: () => void;
    boundingBox: Box3Helper;
    boundingBoxShadow: Box3Helper;
    box3: () => Box3;
  }

  export class Threebox {
    camera: THREE.Camera;
    constructor(
      map: Map,
      context: WebGLRenderingContext,
      options: ThreeboxOptions
    );

    loadGLTF(options: LoadGLTFOptions): Promise<Group>;
    add(object: LoadGLTFOptions | Group): this;
    update(): void;
    remove(object: LoadGLTFOptions | Group): this;
    loadObj(
      options: LoadGLTFOptions,
      callback: (model: LoadGLTFOptions) => void
    ): void;
  }
}
