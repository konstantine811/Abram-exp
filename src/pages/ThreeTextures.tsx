import Experience from "@/components/three-scenes/three-simple-scene/Experience";
import TexturesLesson from "@/components/three-scenes/three-simple-scene/TexturesLesson";
import { Environment } from "@react-three/drei";

const ThreeTextures = () => {
  return (
    <Experience>
      <TexturesLesson />
      <ambientLight intensity={1} />
      <Environment preset="sunset" />
    </Experience>
  );
};

export default ThreeTextures;
