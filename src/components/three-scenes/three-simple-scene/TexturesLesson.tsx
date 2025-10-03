import { useVideoTexture } from "@react-three/drei";

const TexturesLesson = () => {
  const texture = useVideoTexture("textures/spongebob-squarepants.mp4");
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default TexturesLesson;
