import { Matrix4 } from "three";

export function makePerspectiveMatrix(
  fovy: number,
  aspect: number,
  near: number,
  far: number
): Matrix4 {
  const out = new Matrix4();
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  out.set(
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * nf,
    -1,
    0,
    0,
    2 * far * near * nf,
    0
  );
  return out;
}
