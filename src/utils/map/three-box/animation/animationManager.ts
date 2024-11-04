import { Map } from "mapbox-gl";
import { AnimationObject3D } from "./animationObject";
import { MapObject3D } from "../objects/Objects3d";
import {
  AnimationTypes,
  IAnimationFollowPathOptions,
  IObjectOptions,
} from "@/models/map/three-box/three-box";
import { Vector3 } from "three";

export class AnimationManager {
  private static instance: AnimationManager; // Статична змінна для зберігання єдиного екземпляра
  private map: Map;
  private enrolledObjects: AnimationObject3D[] = [];
  private previousFrameTime = 0;

  // Приватний конструктор для заборони прямого створення об'єктів класу
  private constructor(map: Map) {
    this.map = map;
  }

  // Статичний метод для отримання єдиного екземпляра
  public static getInstance(map: Map): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager(map);
    }
    return AnimationManager.instance;
  }

  public enroll(obj: MapObject3D) {
    const animationObj = new AnimationObject3D(obj, this.map);
    this.enrolledObjects.push(animationObj);
  }

  get defaults() {
    return {
      options: {
        path: null,
        duration: 1000,
        trackHeading: true,
      },
    };
  }

  update(now: number) {
    if (this.previousFrameTime === 0) {
      this.previousFrameTime = now;
    }

    for (let a = this.enrolledObjects.length - 1; a >= 0; a--) {
      const object = this.enrolledObjects[a];
      if (!object.animationQueue || !object.animationQueue.length) continue;

      const item = object.animationQueue[0];
      const options = item.options as IAnimationFollowPathOptions;

      if (
        typeof options.expiration === "number" &&
        options.start >= options.expiration
      ) {
        object.animationQueue.shift();
        if (object.animationQueue[0]) {
          (
            object.animationQueue[0].options as IAnimationFollowPathOptions
          ).start = now;
          return;
        }
      }

      const expiring =
        typeof options.expiration === "number" && now >= options.expiration;

      if (expiring) {
        options.expiration = false;
        if (options.endState) {
          object.setObject(options.endState);
          options.cb();
        }
      } else {
        const timeProgress = (now - options.start) / options.duration;
        const objectState: IObjectOptions = { duration: 0 };
        if (item.type === AnimationTypes.SET) {
          if (options.pathCurve) {
            objectState.worldCoordinates =
              options.pathCurve.getPointAt(timeProgress);
          }
          if (options.rotationPerMs && options.startRoration) {
            objectState.rotation = options.startRoration.map((rad, index) => {
              if (options.rotationPerMs && options.rotationPerMs[index]) {
                return (
                  rad +
                  options.rotationPerMs[index] * timeProgress * options.duration
                );
              } else {
                return 1;
              }
            }) as [number, number, number];
          }
          if (options.scalePerMs && options.startScale) {
            objectState.scale = options.startScale.map((s, i) => {
              if (options.scalePerMs && options.scalePerMs[i]) {
                return (
                  s + options.scalePerMs[i] * timeProgress * options.duration
                );
              } else {
                return 1;
              }
            }) as [number, number, number];
          }

          object.setObject(objectState);
        }
        if (item.type === AnimationTypes.FOLLOW_PATH) {
          if (options.pathCurve) {
            const position = options.pathCurve.getPointAt(timeProgress);
            objectState.worldCoordinates = position;

            if (options.trackHeading) {
              const tangent = options.pathCurve
                .getTangentAt(timeProgress)
                .normalize();
              const axis = new Vector3(0, 0, 0);
              const up = new Vector3(0, 1, 0);
              axis.crossVectors(up, tangent).normalize();
              const radians = Math.acos(up.dot(tangent));
              objectState.quaternion = [axis.x, axis.y, axis.z, radians];
            }
            object.setObject(objectState);
          }
        }
      }
      this.previousFrameTime = now;
    }
  }
}
