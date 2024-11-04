import { useHelper } from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import {
  DirectionalLight,
  DirectionalLightHelper,
  PointLight,
  PointLightHelper,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";

const Lights = () => {
  const lightRef = useRef<DirectionalLight>(null!);
  const pointLightRef = useRef<PointLight>(null!);
  useHelper(lightRef, DirectionalLightHelper, 5, "yellow");
  useHelper(pointLightRef, PointLightHelper, 1, "red");

  const { height, radius, angle } = useControls("Lights", {
    angle: { value: 45, min: 0, max: 360 },
    height: { value: 10, min: 0, max: 100 },
    radius: { value: 5, min: 0, max: 10 },
  });

  const { distance, decay } = useControls("Point Light", {
    distance: { value: 10, min: 0, max: 100 },
    decay: { value: 1, min: 0, max: 10 },
  });
  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[
          radius * Math.cos(degToRad(angle)),
          height,
          radius * Math.sin(degToRad(angle)),
        ]}
        intensity={0.5}
        castShadow
      />
      <pointLight
        ref={pointLightRef}
        position={[0, 5, 0]}
        intensity={10.5}
        distance={distance}
        decay={decay}
        castShadow
      />
    </>
  );
};

export default Lights;
