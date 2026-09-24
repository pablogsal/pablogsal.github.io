/**
 * Shared physics for the hero: the constants of the WebGL render
 * (blackhole.ts interpolates them into its shader) and a JavaScript copy of
 * the shader's ray tracer that also records the path (the hero's hover inspector).
 *
 * Units: Schwarzschild radius r_s = 1. Horizon r = 1, photon sphere
 * r = 1.5, ISCO r = 3. Null geodesics use the Newtonian-form trick
 *   d²x/dλ² = -3/2 · h² · x / r⁵,   h = |x × dx/dλ|  (conserved),
 * which reproduces the photon orbit equation u'' + u = 3/2 u².
 */

export const CAM_DIST = 34;
export const FOV = 0.34;
export const ROLL = -0.12;
export const R_IN = 3; // ISCO
export const R_OUT = 12.5;
export const R_MARCH = 30;
export const B_TH = 15;
export const MAX_STEPS = 150;
export const H_STEP = 0.07; // step length = H_STEP · r

/** Ray fates, as the shader sees them. */
export const ESCAPED = 0;
export const DISK = 1;
export const CAPTURED = 2;

export type V3 = [number, number, number];

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a: V3) => Math.sqrt(dot(a, a));
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: V3): V3 => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

export interface Basis {
  /** camera position */
  ro: V3;
  /** unit vector from the camera to the hole */
  fw: V3;
  /** screen right and screen up, after the roll */
  rt: V3;
  up: V3;
}

/** Camera frame for elevation `el` and azimuth `az`, exactly as the shader builds it. */
export function cameraBasis(el: number, az: number): Basis {
  const ro: V3 = [CAM_DIST * Math.cos(el) * Math.sin(az), CAM_DIST * Math.sin(el), -CAM_DIST * Math.cos(el) * Math.cos(az)];
  const fw = norm([-ro[0], -ro[1], -ro[2]]);
  const rt0 = norm(cross([0, 1, 0], fw));
  const up0 = cross(fw, rt0);
  const cr = Math.cos(ROLL);
  const sr = Math.sin(ROLL);
  const rt: V3 = [0, 0, 0];
  const up: V3 = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    rt[i] = rt0[i] * cr + up0[i] * sr;
    up[i] = up0[i] * cr - rt0[i] * sr;
  }
  return { ro, fw, rt, up };
}

/** Screen uv of a world point (straight projection, no lensing), or null behind the camera. */
export function projectUv(c: Basis, p: V3): [number, number] | null {
  const d: V3 = [p[0] - c.ro[0], p[1] - c.ro[1], p[2] - c.ro[2]];
  const z = dot(d, c.fw);
  if (z < 0.5) return null;
  return [dot(d, c.rt) / z / FOV, dot(d, c.up) / z / FOV];
}

export function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/** Opacity of the disk at radius r (the shader's alpha, before the 0.97). */
export function diskAlpha(r: number): number {
  return smoothstep(R_OUT, R_OUT - 4.5, r) * smoothstep(R_IN - 0.05, R_IN + 0.12, r);
}

/** How hot the gas at p looks along v: the shader's ember weight. */
function diskHot(p: V3, v: V3, r: number): number {
  const vd: V3 = [p[2] / r, 0, -p[0] / r];
  const nv = norm(v);
  const beta = Math.sqrt(0.5 / Math.max(r - 1, 0.6));
  const gamma = 1 / Math.sqrt(1 - beta * beta);
  const D = 1 / (gamma * (1 - beta * -dot(vd, nv)));
  const g = D * Math.sqrt(1 - 1 / r);
  return smoothstep(R_IN + 1.2, R_IN + 0.15, r) * smoothstep(0.7, 1.15, g);
}

/** Deflection still to come between radius r and infinity, impact parameter b. */
export function tailAngle(b: number, r: number): number {
  const s = Math.sqrt(Math.max(1 - (b * b) / (r * r), 0));
  return (1 - 1.5 * s + 0.5 * s * s * s) / Math.max(b, 1e-3);
}

function bendToward(dir: V3, pos: V3, ang: number): V3 {
  const pd = dot(pos, dir);
  const q: V3 = [-pos[0] + pd * dir[0], -pos[1] + pd * dir[1], -pos[2] + pd * dir[2]];
  const l = len(q);
  if (l < 1e-6) return dir;
  const c = Math.cos(ang);
  const s = Math.sin(ang) / l;
  return norm([dir[0] * c + q[0] * s, dir[1] * c + q[1] * s, dir[2] * c + q[2] * s]);
}

export interface Ray {
  /** ESCAPED, DISK or CAPTURED */
  fate: number;
  /** path from the camera: x, y, z per point; the second point is on the marching sphere */
  path: number[];
  /** DISK: where the disk made the ray opaque (trans fell below 0.5) */
  hit: V3 | null;
  /** DISK: index of the path point that ends at the hit */
  hitIndex: number;
  /** DISK: the shader's ember weight at the hit */
  hot: number;
  /** ESCAPED: final sky direction */
  sky: V3 | null;
  /** closest approach to the hole */
  minR: number;
}

/** Trace the ray of screen point (u, v), as the shader does for that pixel. */
export function traceRay(c: Basis, u: number, v: number): Ray {
  const rd = norm([
    c.fw[0] + FOV * (u * c.rt[0] + v * c.up[0]),
    c.fw[1] + FOV * (u * c.rt[1] + v * c.up[1]),
    c.fw[2] + FOV * (u * c.rt[2] + v * c.up[2]),
  ]);
  return traceFrom(c.ro, rd);
}

/**
 * Trace a ray from any point `ro` along the unit direction `rd`. Outside
 * the marching sphere this is the shader's scheme (straight line to the
 * sphere, the far-field bend added in closed form); inside it the march
 * starts at `ro`.
 */
export function traceFrom(ro: V3, rd: V3, maxSteps = MAX_STEPS): Ray {
  const path = [ro[0], ro[1], ro[2]];
  const b = len(cross(ro, rd));
  const tc = -dot(ro, rd);
  let pos: V3;
  let vel: V3;
  if (len(ro) > R_MARCH) {
    if (b > B_TH || tc < 0) {
      const sky = bendToward(rd, ro, tc > 0 ? 2 / b : 0);
      return { fate: ESCAPED, path, hit: null, hitIndex: -1, hot: 0, sky, minR: b };
    }
    const s0 = Math.sqrt(R_MARCH * R_MARCH - b * b);
    pos = [ro[0] + rd[0] * (tc - s0), ro[1] + rd[1] * (tc - s0), ro[2] + rd[2] * (tc - s0)];
    path.push(pos[0], pos[1], pos[2]);
    vel = bendToward(rd, pos, tailAngle(b, R_MARCH));
  } else {
    pos = [ro[0], ro[1], ro[2]];
    vel = [rd[0], rd[1], rd[2]];
  }
  const hv = cross(pos, vel);
  const h2 = dot(hv, hv);
  let r = len(pos);
  let k = (-1.5 * h2) / (r * r * r * r * r);
  let acc: V3 = [k * pos[0], k * pos[1], k * pos[2]];
  let escaped = false;
  let trans = 1;
  let hit: V3 | null = null;
  let hitIndex = -1;
  let hot = 0;
  let minR = r;

  for (let i = 0; i < maxSteps; i++) {
    r = len(pos);
    minR = Math.min(minR, r);
    if (r < 1) break;
    if (r > R_MARCH + 0.5 && dot(pos, vel) > 0) {
      escaped = true;
      break;
    }
    const hs = H_STEP * r;
    const vh: V3 = [vel[0] + acc[0] * 0.5 * hs, vel[1] + acc[1] * 0.5 * hs, vel[2] + acc[2] * 0.5 * hs];
    const np: V3 = [pos[0] + vh[0] * hs, pos[1] + vh[1] * hs, pos[2] + vh[2] * hs];
    const nr = len(np);
    k = (-1.5 * h2) / (nr * nr * nr * nr * nr);
    const nacc: V3 = [k * np[0], k * np[1], k * np[2]];
    vel = [vh[0] + nacc[0] * 0.5 * hs, vh[1] + nacc[1] * 0.5 * hs, vh[2] + nacc[2] * 0.5 * hs];

    if (pos[1] * np[1] < 0) {
      const t = pos[1] / (pos[1] - np[1]);
      const hp: V3 = [pos[0] + (np[0] - pos[0]) * t, 0, pos[2] + (np[2] - pos[2]) * t];
      const rr = Math.hypot(hp[0], hp[2]);
      if (rr > R_IN - 0.05 && rr < R_OUT) {
        const a = diskAlpha(rr) * 0.97;
        const before = trans;
        trans *= 1 - a;
        if (before >= 0.5 && trans < 0.5) {
          hit = hp;
          hot = diskHot(hp, vel, rr);
          path.push(hp[0], hp[1], hp[2]);
          hitIndex = path.length / 3 - 1;
        }
        if (trans < 0.03) break;
      }
    }
    pos = np;
    acc = nacc;
    if (!hit) path.push(pos[0], pos[1], pos[2]);
  }

  if (escaped) {
    const vl = len(vel);
    const bh = Math.sqrt(h2) / vl;
    const sky = bendToward(norm(vel), pos, tailAngle(bh, len(pos)));
    return { fate: trans < 0.5 ? DISK : ESCAPED, path, hit, hitIndex, hot, sky, minR };
  }
  return { fate: trans < 0.5 ? DISK : CAPTURED, path, hit, hitIndex, hot, sky: null, minR };
}
