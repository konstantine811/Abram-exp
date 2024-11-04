// import { drawArrayRect } from "@/utils/2d-canvas/array-rect";
import { transformRect } from "@/utils/2d-canvas/transform";
import { useEffect, useRef } from "react";

const CreativeCodingV1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // drawArrayRect(ctx);
        transformRect(ctx);
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
