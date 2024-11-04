import { Group, Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { validate } from "../utils/utils-transform";
import { ISphereObjectOptions } from "@/models/map/three-box/three-box";
import { defaultSphereOptions } from "../utils/config";
import { MapObject3D } from "./Objects3d";
import { AnimationManager } from "../animation/animationManager";
import { Map } from "mapbox-gl";

export class Sphere {
  private _object: MapObject3D;
  constructor(
    options: ISphereObjectOptions,
    world: Group,
    animationManager: AnimationManager,
    map: Map,
    isStatic: boolean
  ) {
    const objOptions = validate(options, defaultSphereOptions);
    const geometry = new SphereGeometry(
      objOptions.radius,
      objOptions.sides,
      objOptions.sides
    );
    const mateiral = new MeshBasicMaterial({
      color: objOptions.color,
      opacity: objOptions.opacity,
    });
    const output = new Mesh(geometry, mateiral);
    this._object = new MapObject3D(
      output,
      world,
      animationManager,
      map,
      isStatic
    );
    this._object.coords = objOptions.position;
    this._object.add();
    // if (objOptions.units === "meters") {
    //     this._object.
    // }
  }

  get object() {
    return this._object;
  }
}
