import { Box, Component, Film, Globe, Swords } from "lucide-react";
import ThreeSimpleScene from "../pages/ThreeSimpleScene";
import TrainAnimationSpring from "../pages/TrainAnimationString";
import ThreeMap from "../pages/ThreeMap";
import ThreeMapDraw from "../pages/ThreeMapDraw";
import CreativeCodingV1 from "../pages/CreateCoding_v1";
import TwoDGameV1 from "@/pages/2dGame_v1";

export const navigationConfig = [
  {
    path: "/",
    element: <ThreeSimpleScene />,
    icon: <Box />,
  },
  {
    path: "/spring",
    element: <TrainAnimationSpring />,
    icon: <Film />,
  },
  {
    path: "/three-map",
    element: <ThreeMap />,
    icon: <Globe />,
  },
  {
    path: "/three-map-draw",
    element: <ThreeMapDraw />,
    icon: <Globe />,
  },
  {
    path: "/creative-coding-v1",
    element: <CreativeCodingV1 />,
    icon: <Component />,
  },
  {
    path: "/2d-game-v1",
    element: <TwoDGameV1 />,
    icon: <Swords />,
  },
];
