import { Vector2Type, Vector3Type } from "@/models/map/three-box/three-box";
import { WORLD_CONFIG } from "./config";
import { Vector3 } from "three";

export function extend<T, D>(original: T, extension: D): T & D {
  return Object.assign({}, original, extension);
}

export function typeScale(
  s: Vector3Type | number | undefined,
  currentScale: Vector3Type
): Vector3Type {
  if (typeof s === "number") {
    return [s, s, s];
  } else if (Array.isArray(s)) {
    return applyDefault(s, currentScale);
  }
  return currentScale;
}

export function applyDefault(
  arr: Vector3Type,
  current: Vector3Type
): Vector3Type {
  return arr.map((v, i) => {
    if (v === undefined) {
      return current[i];
    }
    return v;
  }) as Vector3Type;
}

export function projectToWorld(coords: Vector3Type | Vector2Type): Vector3 {
  // Spherical mercator forward projection, re-scaling to WORLD_SIZE
  const projected = [
    -WORLD_CONFIG.MERCATOR_A *
      WORLD_CONFIG.DEG2RAD *
      coords[0] *
      WORLD_CONFIG.PROJECTION_WORLD_SIZE,
    -WORLD_CONFIG.MERCATOR_A *
      Math.log(
        Math.tan(Math.PI * 0.25) + 0.5 * coords[1] * WORLD_CONFIG.DEG2RAD
      ) *
      WORLD_CONFIG.PROJECTION_WORLD_SIZE,
  ];
  //z dimension, defaulting to 0 if not provided
  if (!coords[2]) {
    projected.push(0);
  } else {
    const pixelsPerMeter = projectedUnitsPerMeter(coords[1]);
    projected.push(coords[2] * pixelsPerMeter);
  }
  return new Vector3(projected[0], projected[1], projected[2]);
}

export function projectedUnitsPerMeter(latitude: number) {
  return Math.abs(
    WORLD_CONFIG.WORLD_SIZE /
      Math.cos(WORLD_CONFIG.DEG2RAD * latitude) /
      WORLD_CONFIG.EARTH_CIRCUMFERENCE
  );
}

export function lnglatsToWorld(
  coords: (Vector3Type | Vector2Type)[]
): Vector3[] {
  return coords.map((coord) => projectToWorld(coord));
}

function convertDeg(deg: number) {
  deg = deg || 0;
  return (Math.PI * 2 * deg) / 360;
}

export function radify(deg: Vector3Type | number): Vector3Type | number {
  if (typeof deg === "number") {
    return convertDeg(deg);
  }
  return deg.map(convertDeg) as Vector3Type;
}

export function validate<T>(userInputs: Partial<T>, defaults: T): T {
  // Ініціалізація `userInputs`, якщо він не заданий
  userInputs = userInputs || {};
  const validatedOutput: T = {} as T;
  // Копіювання даних користувача у validatedOutput
  extend(validatedOutput, userInputs);
  if (defaults) {
    // Перевірка кожного ключа з об'єкта `defaults`
    for (const key of Object.keys(defaults) as Array<keyof T>) {
      // Якщо значення користувача відсутнє, використовуємо значення за замовчуванням
      if (userInputs[key] === undefined) {
        if (defaults[key] === null) {
          console.error(`${String(key)} is required`);
          return validatedOutput;
        } else {
          validatedOutput[key] = defaults[key];
        }
      } else {
        validatedOutput[key] = userInputs[key]!;
      }
    }
  }

  return validatedOutput;
}
