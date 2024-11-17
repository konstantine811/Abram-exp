import LightHouse from "@/components/three-scenes/three-simple-scene/LightHouse";
import MoveableItem from "@/components/three-scenes/three-simple-scene/MoveableItem";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const ThreeSimpleModel = () => {
  return (
    <div className="h-screen">
      <Canvas camera={{ position: [-1.5, 3, 10], fov: 42 }}>
        <OrbitControls enableRotate={false} />
        <MoveableItem>
          <LightHouse />
        </MoveableItem>
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default ThreeSimpleModel;
