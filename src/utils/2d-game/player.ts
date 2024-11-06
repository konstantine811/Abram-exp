import { IPosition, ISize } from "@/models/2dGame/player.model";

export class Player {
  private position: IPosition;
  private velocity = { x: 0, y: 1 };
  private c: CanvasRenderingContext2D;
  private gravity = 0.098;
  private playerSize: ISize = { width: 100, height: 100 };
  private canvasHeight = 0;

  constructor(
    c: CanvasRenderingContext2D,
    height: number,
    position = { x: 0, y: 0 },
    size: ISize = { width: 100, height: 100 }
  ) {
    this.c = c;
    this.canvasHeight = height;
    this.position = position;
    this.playerSize = size;
  }

  draw() {
    this.c.fillStyle = "red";
    this.c.fillRect(
      this.position.x,
      this.position.y,
      this.playerSize.width,
      this.playerSize.height
    );
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    if (
      this.position.y + this.playerSize.height + this.velocity.y <
      this.canvasHeight
    ) {
      this.velocity.y += this.gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}
