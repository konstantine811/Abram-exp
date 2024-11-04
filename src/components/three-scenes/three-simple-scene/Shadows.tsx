import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import { memo } from "react";

const Shadows = memo(() => {
  return (
    <AccumulativeShadows
      position={[0, 0.001, 0]}
      temporal
      frames={100}
      color="#4b5563"
      colorBlend={0.5}
      alphaTest={0.9}
      scale={20}
    >
      <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
    </AccumulativeShadows>
  );
});

export default Shadows;
