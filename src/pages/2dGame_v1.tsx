import { Init2dGame } from "@/utils/2d-game/init";
import { useEffect, useRef, useState } from "react";

const TwoDGameV1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = windowSize.width;
      canvas.height = windowSize.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        new Init2dGame(ctx, canvas, windowSize.width, windowSize.height);
      }
    }
    return () => {
      canvas
        ?.getContext("2d")
        ?.clearRect(0, 0, windowSize.width, windowSize.height);
    };
  }, [windowSize]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default TwoDGameV1;
