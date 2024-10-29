import { Map } from "mapbox-gl";
import { AnimationObject3D } from "./animationObject";
import { MapObject3D } from "../objects/Objects3d";
import { IAnimationFollowPathOptions } from "@/models/map/three-box/three-box";

export class AnimationManager {
  private map: Map;
  // Масив об'єктів, які беруть участь в анімаціях.
  private enrolledObjects: AnimationObject3D[] = [];
  // Час попереднього кадру для коректного відтворення анімацій.
  private previousFrameTime = 0;

  constructor(map: Map) {
    this.map = map;
  }

  enroll(obj: MapObject3D) {
    // Give this object its own internal animation queue
    const animationObj = new AnimationObject3D(obj, this.map);
    /* Extend the provided object with animation-specific properties and track in the animation manager */
    this.enrolledObjects.push(animationObj);
  }

  update(now: number) {
    if (this.previousFrameTime === 0) {
      this.previousFrameTime = now;
    }
    // const dimensions = ["x", "y", "z"];

    // Ітерація в зворотному порядку, щоб безпечно видаляти об’єкти з черги без зсуву індексів
    for (let a = this.enrolledObjects.length - 1; a >= 0; a--) {
      const object = this.enrolledObjects[a];
      // Якщо черга анімації порожня, пропускаємо об'єкт
      if (!object.animationQueue || !object.animationQueue.length) continue;
      // Беремо перший елемент черги
      const item = object.animationQueue[0];
      const options = item.options as IAnimationFollowPathOptions;
      // Перевіряємо, чи закінчився термін дії анімації, якщо так — видаляємо її з черги
      if (options.start >= options.expiration) {
        // Видалення першого елементу
        object.animationQueue.shift();
        // Встановлення нового часу початку для наступної анімації, якщо вона є
        if (object.animationQueue[0]) {
          (
            object.animationQueue[0].options as IAnimationFollowPathOptions
          ).start = now;
          return; // Пропускаємо подальше виконання
        }
      }
      // Якщо анімація завершена, переходимо до кінцевого стану та виконуємо зворотний виклик
      // const expiring = now >= options.expiration;
      // not ended
    }
  }
}
