import { PivotControls } from "@react-three/drei";
import { useRef } from "react";
import { Group, Quaternion, Vector3 } from "three";

interface Props {
  children: React.ReactNode;
}

const MoveableItem = ({ children }: Props) => {
  const ref = useRef<Group>(null!);

  const displayItemNewPosition = () => {
    const newPosition = new Vector3();
    ref.current.getWorldPosition(newPosition);
    console.log("Position:", newPosition);
    const newRotation = new Quaternion();
    ref.current.getWorldQuaternion(newRotation);
    console.log("Rotation:", newRotation);
  };
  return (
    <PivotControls depthTest={false} onDragEnd={displayItemNewPosition}>
      <group ref={ref}>{children}</group>
    </PivotControls>
  );
};

export default MoveableItem;
