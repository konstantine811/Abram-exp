import { useEffect, useRef } from "react";

const TwoDGameV1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        console.log("2d game v1");
      }
    }
  }, []);
  return <canvas ref={canvasRef}></canvas>;
};

export default TwoDGameV1;
