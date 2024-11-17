import useTheme from "@/hooks/r3f-hooks/useTheme";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { memo, useMemo, useRef } from "react";
import { Mesh } from "three";

interface Props {
  rotationY: number;
  onClick: () => void;
}

const Cube = memo(({ rotationY, onClick }: Props) => {
  const { color } = useTheme();
  const cubeRef = useRef<Mesh>(null!);
  const material = useMemo(
    () => <meshStandardMaterial color={color} />,
    [color]
  );
  const { speed } = useControls("Speed", {
    speed: { min: -100, max: 100, value: 0 },
  });

  useFrame((_state, delta) => {
    if (!cubeRef.current) return;
    cubeRef.current.rotation.y += speed * delta;
  });
  return (
    <mesh ref={cubeRef} rotation-y={rotationY} onClick={onClick}>
      <boxGeometry />
      {material}
    </mesh>
  );
});

export default Cube;
