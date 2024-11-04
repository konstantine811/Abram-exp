import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface Props {
  children: React.ReactNode;
}
const Experience = ({ children }: Props) => {
  return (
    <div className="h-screen">
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
    </div>
  );
};

export default Experience;
