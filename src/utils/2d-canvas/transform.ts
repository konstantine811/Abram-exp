import { degToRad } from "./utils";

export function transformRect(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "white";
  const width = 600;
  const height = 600;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "black";

  const cx = width * 0.5;
  const cy = height * 0.5;
  const w = width * 0.01;
  const h = height * 0.1;
  let x, y;

  const num = 60;
  const radius = width * 0.3;
  for (let i = 0; i < num; i++) {
    const slice = degToRad(360 / num);
    const angle = slice * i;

    x = cx + radius * Math.sin(angle);
    y = cy + radius * Math.cos(angle);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-angle);
    ctx.beginPath();
    ctx.rect(-w * 0.5, -h * 0.5, w, h);
    ctx.fill();
    ctx.restore();
  }
}
