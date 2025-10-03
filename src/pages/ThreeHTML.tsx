import Experience from "@/components/three-scenes/three-simple-scene/Experience";
import ThreeHTMLLesson from "@/components/three-scenes/three-simple-scene/ThreeHTMLLesson";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";

const ThreeHTML = () => {
  return (
    <Experience>
      <group position-y={-2}>
        <ThreeHTMLLesson />
        <ContactShadows opacity={0.32} blur={2} />
      </group>
      <ambientLight intensity={1} />
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        minDistance={8}
        maxDistance={20}
      />
      <Environment preset="warehouse" />
    </Experience>
  );
};

export default ThreeHTML;
