import { useEffect, useRef } from "react";

const CreativeCodingV1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);

        ctx.lineWidth = 4;
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.rect(100, 100, 100, 100);
        ctx.stroke();

        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.arc(300, 200, 50, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="border border-white"
      width="600"
      height="600"
    ></canvas>
  );
};

export default CreativeCodingV1;
