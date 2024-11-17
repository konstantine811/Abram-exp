import { useGLTF } from "@react-three/drei";
import { Material, Mesh } from "three";

const LightHouse = () => {
  const { nodes, materials } = useGLTF("models/Lighthouse.glb") as unknown as {
    nodes: { [key: string]: Mesh };
    materials: { [key: string]: Material };
  };

  return (
    <>
      {nodes["Lighthouse"].geometry && (
        <group position-y={-1} scale={[0.2, 0.2, 0.2]}>
          <mesh
            geometry={nodes.Lighthouse.geometry}
            material={materials.lambert2SG}
          />
        </group>
      )}
    </>
  );
};

useGLTF.preload("models/Lighthouse.glb", false, false);

export default LightHouse;
