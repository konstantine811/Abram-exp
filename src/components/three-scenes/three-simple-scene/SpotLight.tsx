import { useHelper, SpotLight } from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import { SpotLight as TSpotLight, SpotLightHelper } from "three";

const CustomSpotLight = () => {
  const {
    color,
    distance,
    attenuation,
    angle,
    anglePower,
    x,
    y,
    z,
    intensity,
  } = useControls("Spot Light", {
    color: "#876ae5",
    distance: { value: 10, min: 0, max: 100 },
    attenuation: { value: 10, min: 0, max: 10 },
    angle: { value: 0.5, min: 0, max: 1 },
    anglePower: { value: 6, min: 0, max: 100 },
    x: { value: -5, min: -10, max: 10 },
    y: { value: 5, min: 0, max: 10 },
    z: { value: 0, min: -10, max: 10 },
    intensity: { value: 100, min: 0, max: 10000, step: 10 },
  });
  const lightRef = useRef<TSpotLight>(null!);
  useHelper(lightRef, SpotLightHelper, "red");
  return (
    <SpotLight
      castShadow
      ref={lightRef}
      color={color}
      distance={distance}
      angle={angle}
      attenuation={attenuation}
      anglePower={anglePower}
      position={[x, y, z]}
      intensity={intensity}
    />
  );
};

export default CustomSpotLight;
