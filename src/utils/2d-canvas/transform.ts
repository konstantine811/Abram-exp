import { degToRad } from "canvas-sketch-util/math";
import { range } from "canvas-sketch-util/random";

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

  const num = 120;
  const radius = width * 0.3;
  for (let i = 0; i < num; i++) {
    const slice = degToRad(360 / num);
    const angle = slice * i;

    x = cx + radius * Math.sin(angle);
    y = cy + radius * Math.cos(angle);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-angle);
    ctx.scale(range(0.1, 2), range(0.2, 0.5));
    ctx.beginPath();
    ctx.rect(-w * 0.5, range(0, -h * 0.5), w, h);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-angle);
    ctx.lineWidth = range(1, 10);
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      radius * range(0.7, 1.3),
      slice * range(1, -8),
      slice * range(1, 5)
    );
    ctx.stroke();
    ctx.restore();
  }
}
