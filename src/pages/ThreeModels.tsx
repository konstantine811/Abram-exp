import Experience from "@/components/three-scenes/three-simple-scene/Experience";
import { Fish } from "@/components/three-scenes/three-simple-scene/Fish";
import ThreeModelScene from "@/components/three-scenes/three-simple-scene/ThreeModelScene";
import { Environment } from "@react-three/drei";

const ThreeModels = () => {
  return (
    <Experience>
      <ThreeModelScene />
      <Fish position={[-3, 0, -3]} />
      <ambientLight intensity={1} />
      <Environment preset="sunset" />
    </Experience>
  );
};

export default ThreeModels;
