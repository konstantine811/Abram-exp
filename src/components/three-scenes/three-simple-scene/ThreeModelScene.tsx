import { useFBX, useGLTF } from "@react-three/drei";

const ThreeModelScene = () => {
  const { scene } = useGLTF("models/Fish.gltf");
  const dino = useFBX("models/Dino.fbx");
  return (
    <>
      <primitive object={scene} />
      <primitive object={dino} scale={0.01} position-x={-3} />
    </>
  );
};

export default ThreeModelScene;
