import { Controls } from "@/config/common-three-world";
import { useCursor, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FC, useRef, useState } from "react";
import { Mesh } from "three";

type MoveableSphereProps = JSX.IntrinsicElements["mesh"];

const MoveableSphere: FC<MoveableSphereProps> = (props) => {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  useCursor(hovered);
  const ref = useRef<Mesh>(null!);
  const MOVEMENT_SPEED = 0.05;

  let color = hovered ? "pink" : "white";
  if (selected) color = "hotpink";

  const forwardPress = useKeyboardControls((state) => state[Controls.forward]);
  const backPress = useKeyboardControls((state) => state[Controls.backward]);
  const leftPress = useKeyboardControls((state) => state[Controls.left]);
  const rightPress = useKeyboardControls((state) => state[Controls.right]);

  useFrame(() => {
    if (!selected) return;
    if (forwardPress) {
      ref.current.position.y += MOVEMENT_SPEED;
    }
    if (backPress) {
      ref.current.position.y -= MOVEMENT_SPEED;
    }
    if (leftPress) {
      ref.current.position.x -= MOVEMENT_SPEED;
    }
    if (rightPress) {
      ref.current.position.x += MOVEMENT_SPEED;
    }
  });
  return (
    <mesh
      ref={ref}
      {...props}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(!selected);
      }}
      onPointerMissed={() => setSelected(false)}
    >
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default MoveableSphere;
