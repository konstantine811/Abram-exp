export function drawArrayRect(ctx: CanvasRenderingContext2D) {
  const rectWidth = 60;
  const rectHeight = 60;
  const gap = 20;
  let x: number;
  let y: number;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      x = 100 + (rectWidth + gap) * i;
      y = 100 + (rectHeight + gap) * j;
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.rect(x, y, rectWidth, rectHeight);
      ctx.stroke();
      if (Math.random() > 0.5) {
        ctx.beginPath();
        ctx.rect(x + 8, y + 8, rectWidth - 16, rectHeight - 16);
        ctx.stroke();
      }
    }
  }
}
