import { Controls } from "@/config/common-three-world";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";

interface Props {
  children: React.ReactNode;
}
const Experience = ({ children }: Props) => {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
      { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
      { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
      { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
    ],
    []
  );
  return (
    <div className="h-screen">
      <KeyboardControls map={map}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
          camera={{ position: [0, 5, 5] }}
        >
          <color attach="background" args={["#141622"]} />
          <OrbitControls
            rotation={[Math.PI * 0.5, 0, Math.PI * 0.5]}
            position={[10, 1, 3]}
          />
          {children}
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default Experience;
