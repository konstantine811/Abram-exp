import Experience from "@/components/three-scenes/three-simple-scene/Experience";
import WavyGrid from "@/components/three-scenes/three-simple-scene/WavyGrid";

const ThreeTutorial = () => {
  // const args: [number, number, number, number] = [1, 0.3, 12, 12];
  return (
    <Experience>
      {/* <mesh>
        <torusGeometry args={args} />
        <meshBasicMaterial color="black" />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new TorusGeometry(...args)]} />
        <lineBasicMaterial color="white" />
      </lineSegments> */}
      <WavyGrid />
      {/* Обводка */}
      <ambientLight intensity={1} />
    </Experience>
  );
};

export default ThreeTutorial;
