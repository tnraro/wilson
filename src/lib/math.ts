export interface IVec2 {
  x: number,
  y: number,
}
export const distance = (a: IVec2, b: IVec2) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
export const norm = (v: IVec2) => {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
export const normalize = (v: IVec2) => {
  const r = norm(v);
  return {
    x: v.x / r,
    y: v.y / r,
  };
}
export const vec2 = (x: number, y: number): IVec2 => ({ x, y });
export const sub = (a: IVec2, b: IVec2): IVec2 => ({
  x: a.x - b.x,
  y: a.y - b.y
});
export const add = (a: IVec2, b: IVec2): IVec2 => ({
  x: a.x + b.x,
  y: a.y + b.y
});
export const mul = (v: IVec2, s: number): IVec2 => ({
  x: v.x * s,
  y: v.y * s,
})
export const div = (v: IVec2, s: number): IVec2 => ({
  x: v.x / s,
  y: v.y / s,
})
export const lerp = (v0: IVec2, v1: IVec2, t: number) => ({
  x: (v1.x - v0.x) * t + v0.x,
  y: (v1.y - v0.y) * t + v0.y,
})
export const translation = (tx: number, ty: number) => [1, 0, 0, 0, 1, 0, tx, ty, 1];
export const rotation = (radian: number) => {
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  return [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
};
export const scaling = (sx: number, sy: number) => [sx, 0, 0, 0, sy, 0, 0, 0, 1];
export const multiply = (m1: number[], m2: number[]) => [
  m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6],
  m1[0] * m2[1] + m1[1] * m2[4] + m1[2] * m2[7],
  m1[0] * m2[2] + m1[1] * m2[5] + m1[2] * m2[8],

  m1[3] * m2[0] + m1[4] * m2[3] + m1[5] * m2[6],
  m1[3] * m2[1] + m1[4] * m2[4] + m1[5] * m2[7],
  m1[3] * m2[2] + m1[4] * m2[5] + m1[5] * m2[8],

  m1[6] * m2[0] + m1[7] * m2[3] + m1[8] * m2[6],
  m1[6] * m2[1] + m1[7] * m2[4] + m1[8] * m2[7],
  m1[6] * m2[2] + m1[7] * m2[5] + m1[8] * m2[8],
];
export const identity = () => [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
];