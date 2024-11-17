import useTheme from "@/hooks/r3f-hooks/useTheme";
import { button, useControls } from "leva";

const UIColorChange = () => {
  const { setColor } = useTheme();
  useControls({
    changeColorToRed: button(() => setColor("red")),
    changeColorToBlue: button(() => setColor("blue")),
    changeColorToGreen: button(() => setColor("green")),
  });
  return null;
};

export default UIColorChange;
