import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  DoubleSide,
  EdgesGeometry,
  LineSegments,
  Mesh,
  PlaneGeometry,
} from "three";

const WavyGrid = () => {
  const args: [number, number, number, number] = [5, 5, 8, 8];
  const meshRef = useRef<Mesh>(null!);
  const edgesRef = useRef<LineSegments>(null!);
  const clock = useRef(0);
  // Анімація хвиль
  useFrame(() => {
    if (meshRef.current && edgesRef.current) {
      const { array } = edgesRef.current.geometry.attributes.position;

      clock.current += 0.004; // Швидкість хвиль

      for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];

        // Ефект вітру: додаємо зміщення хвиль по осі x
        array[i + 2] =
          Math.sin(x * 2 + clock.current * 1.5) * 0.4 + // Основний "вітер"
          Math.sin(y * 1.5 + clock.current * 0.5) * 0.2; // Другий шар хвиль
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      edgesRef.current.geometry = new EdgesGeometry(edgesRef.current.geometry);

      // Оновлення обводки
    }
  });

  return (
    <>
      {/* Основна площина */}
      <mesh ref={meshRef}>
        <planeGeometry args={args} />{" "}
        <meshBasicMaterial color="black" side={DoubleSide} depthTest={false} />
      </mesh>

      {/* Краї */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry attach="geometry" args={[new PlaneGeometry(...args)]} />
        <lineBasicMaterial color="white" />
      </lineSegments>
    </>
  );
};

export default WavyGrid;
