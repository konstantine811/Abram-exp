import { Player } from "./player";

export class Init2dGame {
  private _canvas: HTMLCanvasElement;
  private windowSize: { width: number; height: number };
  private ctx: CanvasRenderingContext2D;
  private player!: Player;
  private player2!: Player;
  constructor(
    ctx: CanvasRenderingContext2D,
    canvasEl: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    this._canvas = canvasEl;
    this.windowSize = { width, height };
    this.ctx = ctx;
    this.init();
  }

  get canvas() {
    return this._canvas;
  }

  private init() {
    this.player = new Player(this.ctx, this.windowSize.height);
    this.player2 = new Player(this.ctx, this.windowSize.height, {
      x: 200,
      y: 200,
    });
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.windowSize.width, this.windowSize.height);
    this.player.update();
    this.player2.update();
  }
}
