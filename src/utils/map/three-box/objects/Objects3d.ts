import { Vector3Type } from "@/models/map/three-box/three-box";
import { Object3D } from "three";

export class MapObject3D {
  private _object: Object3D;
  private _coordinates: Vector3Type = [0, 0, 0];
  constructor(obj: Object3D, isStatic: boolean) {
    this._object = obj;
    if (isStatic) {
      obj.userData.units = obj.userData.units || "meters";
    }
  }

  get coordinates(): Vector3Type {
    return this._coordinates;
  }

  get object(): Object3D {
    return this._object;
  }
}
