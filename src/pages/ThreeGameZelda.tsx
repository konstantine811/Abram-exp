import { useRef } from "react";

const ThreeGameZelda = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return <canvas ref={canvasRef}></canvas>;
};

export default ThreeGameZelda;
