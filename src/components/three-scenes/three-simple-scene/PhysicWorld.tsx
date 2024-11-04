import Polygon from "@/components/Polygon";
import { Physics, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";

const PhysicWorld = () => {
  const { position, color, opacity, transparent } = useControls({
    position: {
      x: 0,
      y: 4,
      z: 0,
    },
    color: "#ff0000",
    opacity: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    transparent: true,
  });
  return (
    <Physics>
      {/* <Pointer /> */}
      <Polygon />
      <RigidBody type="fixed">
        <mesh
          rotation-x={-Math.PI * 0.5}
          castShadow
          receiveShadow
          position={[-3, 0, 0]}
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
      </RigidBody>
      <RigidBody type="dynamic">
        <mesh
          rotation-x={Math.PI * 0.5}
          castShadow
          receiveShadow
          position={[position.x, position.y, position.z]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={color}
            transparent={transparent}
            opacity={opacity}
          />
        </mesh>
      </RigidBody>
      {/* Add ambient light */}

      {/* Render the polygon */}
    </Physics>
  );
};

export default PhysicWorld;
