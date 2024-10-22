import { DoubleSide, Shape as ThreeShape } from "three";
import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";

const Polygon = () => {
  // Define the vertices of the polygon (e.g., a pentagon)
  const vertices = [
    [0, 1], // Top vertex
    [0.951, 0.309], // Top-right vertex
    [0.588, -0.809], // Bottom-right vertex
    [-0.588, -0.809], // Bottom-left vertex
    [-0.951, 0.309], // Top-left vertex
  ];

  // Create the shape using the vertices
  const shape = useMemo(() => {
    const shape = new ThreeShape();
    // Move to the first vertex
    shape.moveTo(vertices[0][0], vertices[0][1]);
    // Draw lines to subsequent vertices
    vertices.slice(1).forEach(([x, y]) => {
      shape.lineTo(x, y);
    });
    // Close the shape by connecting to the first vertex
    shape.closePath(); // Use closePath() instead of lineTo() to the first vertex
    return shape;
  }, [vertices]);
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
        <meshStandardMaterial side={DoubleSide} color="red" />
      </mesh>
    </RigidBody>
  );
};

export default Polygon;
