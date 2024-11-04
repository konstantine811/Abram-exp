import {
  ILineObjectOptions,
  IObjectMaterialTypes,
  IObjectUntis,
  ISphereObjectOptions,
  ITubeObjectOptions,
} from "@/models/map/three-box/three-box";

const WORLD_SIZE = 1024000;
const MERCATOR_A = 6378137.0;

export const WORLD_CONFIG = {
  WORLD_SIZE: WORLD_SIZE,
  PROJECTION_WORLD_SIZE: WORLD_SIZE / (MERCATOR_A * Math.PI * 2),
  MERCATOR_A: MERCATOR_A, // 900913 projection property
  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,
  EARTH_CIRCUMFERENCE: 40075000, // In meters
};

export const defaultOptions = {
  defaultLights: false,
  passiveRendering: true,
};

export const defaultSphereOptions: ISphereObjectOptions = {
  position: [0, 0, 0],
  radius: 1,
  units: IObjectUntis.sceneUnits,
  sides: 20,
  material: IObjectMaterialTypes.meshBasicMaterial,
  color: "#000000",
  opacity: 1,
};

export const defaultsLineOptions: ILineObjectOptions = {
  geometry: [
    [0, 0],
    [0, 0],
  ],
  color: "#000000",
  width: 1,
  opacity: 1,
};

export const defaultsTubeOptions: ITubeObjectOptions = {
  geometry: [
    [0, 0],
    [0, 0],
  ],
  radius: 1,
  sides: 6,
  material: IObjectMaterialTypes.meshBasicMaterial,
  color: "#000000",
  opacity: 1,
};

export const defaultsMaterialOptions = {
  material: IObjectMaterialTypes.meshBasicMaterial,
  color: "#000000",
  opacity: 1,
};
