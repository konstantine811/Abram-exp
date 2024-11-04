import { RigidBody } from "@react-three/rapier";

const Polygon = () => {
  return (
    <RigidBody colliders="cuboid" type="dynamic">
      <mesh
        position={[0, 1, 0]}
        castShadow
        receiveShadow
        rotation={[Math.PI / 2, 0, 0]}
      >
        {/* Create geometry from the shape */}
        <boxGeometry args={[0.5, 0.1, 1]} />
        {/* Apply a material */}
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
};

export default Polygon;
