import { GizmoHelper, GizmoViewport, Grid } from "@react-three/drei";
import PhysicWorld from "@/components/three-scenes/three-simple-scene/PhysicWorld";
import Experience from "@/components/three-scenes/three-simple-scene/Experience";
import Lights from "@/components/three-scenes/three-simple-scene/Lights";

const ThreeSimpleScene = () => {
  return (
    <Experience>
      <Lights />
      <axesHelper args={[100]} />
      <Grid
        position={[0, 0.01, 0]}
        args={[10.5, 10.5]}
        cellSize={0.6}
        cellThickness={1}
        cellColor={"#6f6f6f"}
        sectionSize={3.3}
        sectionThickness={0.5}
        sectionColor={"#9b4b4b"}
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={true}
      />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9b4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>

      <PhysicWorld />
    </Experience>
  );
};

export default ThreeSimpleScene;
