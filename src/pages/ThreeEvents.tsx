import Experience from "@/components/three-scenes/three-simple-scene/Experience";
import MoveableSphere from "@/components/three-scenes/three-simple-scene/MoveableSphere";
import { ContactShadows, Environment } from "@react-three/drei";

const ThreeEvents = () => {
  return (
    <Experience>
      <MoveableSphere />
      <MoveableSphere position-x={-2} />
      <MoveableSphere position-x={2} />
      <ContactShadows
        rotation-x={Math.PI / 2}
        position={[0, -1.6, 0]}
        opacity={0.42}
      />
      <Environment preset="sunset" />
    </Experience>
  );
};

export default ThreeEvents;
