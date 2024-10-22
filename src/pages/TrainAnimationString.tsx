import { animated, useSpring } from "@react-spring/web";

const TrainAnimationSpring = () => {
  const springs = useSpring({
    from: { x: 0 },
    to: { x: 300 },
  });
  return (
    <animated.div
      style={{ ...springs }}
      className="w-[80px] h-[80px] bg-violet-800 rounded-xl"
    ></animated.div>
  );
};

export default TrainAnimationSpring;
