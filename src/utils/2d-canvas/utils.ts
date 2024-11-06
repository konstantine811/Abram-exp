export function degToRad(deg: number) {
  return (deg / 180) * Math.PI;
}

export const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
