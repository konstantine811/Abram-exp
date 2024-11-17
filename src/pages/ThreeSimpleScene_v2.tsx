import Cube from "@/components/three-scenes/three-simple-scene/Cube";
import Experience from "@/components/three-scenes/three-simple-scene/Experience";
import Lights from "@/components/three-scenes/three-simple-scene/Lights";
import UIColorChange from "@/components/three-scenes/three-simple-scene/UIColorChange";
import { ThemeProvider } from "@/hooks/r3f-hooks/themeProvider";
import { useCallback, useEffect, useState } from "react";

const ThreeSimpleScene_v2 = () => {
  const [count, setCount] = useState(0);
  const onCubeClicked = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    console.log(`Cube clicked ${count} time${count > 1 ? "s" : ""}`);
  }, [count]);

  return (
    <ThemeProvider>
      <Experience>
        <Lights />
        <UIColorChange />
        <Cube rotationY={Math.PI / 4} onClick={onCubeClicked} />
      </Experience>
    </ThemeProvider>
  );
};

export default ThreeSimpleScene_v2;
