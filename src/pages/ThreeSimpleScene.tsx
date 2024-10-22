import { Canvas, useFrame } from "@react-three/fiber";
import Polygon from "../components/Polygon";
import { Grid, OrbitControls } from "@react-three/drei";
import { DoubleSide, Vector3 } from "three";
import { BallCollider, Physics, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

function Pointer({ vec = new Vector3() }) {
  const ref = useRef();
  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      )
    );
  });
  return (
    <RigidBody
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[1]} />
    </RigidBody>
  );
}

const ThreeSimpleScene = () => {
  return (
    <div className="h-screen">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        camera={{
          position: [0, 10, -5],
          near: 0.1,
          far: 100,
        }}
      >
        <color attach="background" args={["#141622"]} />
        <OrbitControls
          rotation={[Math.PI * 0.5, 0, Math.PI * 0.5]}
          position={[10, 1, 3]}
        />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[1, 5, 7]}
          angle={0.15}
          penumbra={1}
          intensity={500}
          castShadow
          shadow-mapSize-width={2048} // Increase shadow map resolution
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[0, 10, 0]} intensity={1} />
        <axesHelper args={[100]} />
        <Grid
          sectionSize={0.1}
          sectionColor={"white"}
          sectionThickness={1}
          cellSize={1}
          cellColor={"black"}
          cellThickness={2}
          infiniteGrid
          fadeDistance={80}
          fadeStrength={10}
        />
        <Physics>
          {/* <Pointer /> */}
          <Polygon />
          <RigidBody type="fixed">
            <mesh
              rotation-x={Math.PI * 0.5}
              castShadow
              receiveShadow
              position={[-3, -0.1, 0]}
            >
              <planeGeometry args={[100, 50]} />
              <meshStandardMaterial side={DoubleSide} color="lightblue" />
            </mesh>
          </RigidBody>
          <RigidBody type="dynamic">
            <mesh
              rotation-x={Math.PI * 0.5}
              castShadow
              receiveShadow
              position={[-1, 3, 1]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial side={DoubleSide} color="lightblue" />
            </mesh>
          </RigidBody>
          {/* Add ambient light */}

          {/* Render the polygon */}
        </Physics>
      </Canvas>
    </div>
  );
};

export default ThreeSimpleScene;
