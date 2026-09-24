/**
 * Real-time Schwarzschild black hole as pixel art.
 *
 * Rendered at a very low internal resolution (about 320×180 on desktop,
 * about 130×280 on a phone) and upscaled by an integer factor with CSS
 * `image-rendering: pixelated`. The image is quantized to five inks
 * (ink, two dark greys, bone, and ember for the hottest inner edge of the
 * disk only) with 4×4 ordered (Bayer) dithering, fixed in screen space.
 *
 * Physics (units: Schwarzschild radius r_s = 1, constants in geodesic.ts):
 *   Null geodesics are integrated with the Newtonian-form trick
 *     d²x/dλ² = -3/2 · h² · x / r⁵,   h = |x × dx/dλ|  (conserved)
 *   which reproduces the Schwarzschild photon orbit equation
 *   u'' + u = 3/2 u², so the photon sphere sits at r = 1.5 and the shadow
 *   edge at impact parameter b = 3√3/2. Rays that stay far from the hole
 *   (b > 15) use the weak-field deflection 2/b analytically; marched rays
 *   get the small deflection outside the marching sphere added back in
 *   closed form, so the two regimes meet without a seam.
 *   Thin Keplerian disk from the ISCO (r = 3) outwards, with Doppler
 *   beaming and gravitational redshift, intensity ∝ g³. A compact source
 *   behind the hole images into an Einstein ring.
 *
 * The camera orbits slowly, its inclination drifts between 75° and 86°,
 * and the pointer (or scroll, on touch screens) tilts it a little.
 * geodesic.ts has the same ray tracer in JavaScript; `onFrame` reports the
 * camera of every frame so an overlay can draw on the same pixel grid.
 *
 * Add ?fps to the URL for a frame-time overlay.
 */

import { B_TH, CAM_DIST, FOV, H_STEP, MAX_STEPS, R_IN, R_MARCH, R_OUT, ROLL, type V3 } from "./geodesic";

/** The view of one frame, in the renderer's own terms. */
export interface ViewFrame {
  /** camera elevation and azimuth (rad), as passed to the shader */
  el: number;
  az: number;
  /** direction of the lensed background source */
  src: V3;
  /** hole centre in buffer pixels (GL origin: y up) and pixels per uv unit */
  center: [number, number];
  radius: number;
  /** buffer size in pixels and CSS pixels per buffer pixel */
  width: number;
  height: number;
  scale: number;
  /** seconds since the previous frame (0 for a still frame) */
  dt: number;
  /** prefers-reduced-motion: a single still frame */
  still: boolean;
}

export interface BlackHoleOptions {
  /** canvas inside `root`; sized and positioned by this module */
  canvas: HTMLCanvasElement;
  /** optional second canvas, given the same pixel grid, drawn over the first */
  overlay?: HTMLCanvasElement;
  /** element whose border box defines the unit circle the hole is drawn in */
  anchor: HTMLElement;
  /** the section; used for size, visibility and parallax */
  root: HTMLElement;
  /** called after the first frame is on screen */
  onReady?: () => void;
  /** called if the context is lost after start */
  onFail?: () => void;
  /** called after every drawn frame */
  onFrame?: (f: ViewFrame) => void;
}

const glf = (x: number) => (Number.isInteger(x) ? `${x}.0` : `${x}`);

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_center;   // hole centre, buffer px (GL origin)
uniform float u_radius;  // buffer px per unit of screen uv
uniform float u_time;
uniform vec2 u_cam;      // camera elevation, azimuth (rad)
uniform vec3 u_src;      // direction of the lensed background source
uniform vec4 u_fade;     // text-side fade: dot(st, xy) from z to w
uniform vec2 u_res;

const float PI = 3.14159265;
const int MAX_STEPS = ${MAX_STEPS};
const float R_IN = ${glf(R_IN)};
const float R_OUT = ${glf(R_OUT)};
const float R_MARCH = ${glf(R_MARCH)};
const float B_TH = ${glf(B_TH)};
const float CAM_DIST = ${glf(CAM_DIST)};
const float FOV = ${glf(FOV)};
const float ROLL = ${glf(ROLL)};
const float H_STEP = ${glf(H_STEP)};

const vec3 INK = vec3(0.039, 0.035, 0.031);    // #0a0908
const vec3 GREY1 = vec3(0.141, 0.133, 0.122);  // #24221f
const vec3 GREY2 = vec3(0.353, 0.333, 0.306);  // #5a554e
const vec3 BONE = vec3(0.925, 0.902, 0.855);   // #ece6da
const vec3 EMBER = vec3(0.878, 0.267, 0.180);  // #e0442e

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(i);
  float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 3; i++) {
    s += a * noise3(p);
    p = p * 2.03 + 11.7;
    a *= 0.5;
  }
  return s;
}

// 4x4 Bayer threshold in [0, 1), fixed to the pixel grid
float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}
float bayer4(vec2 a) {
  return bayer2(0.5 * a) * 0.25 + bayer2(a);
}

float tailAngle(float b, float r) {
  float s = sqrt(max(1.0 - b * b / (r * r), 0.0));
  return (1.0 - 1.5 * s + 0.5 * s * s * s) / max(b, 1e-3);
}

vec3 bendToward(vec3 dir, vec3 pos, float ang) {
  vec3 perp = -pos + dot(pos, dir) * dir;
  float l = length(perp);
  if (l < 1e-6) return dir;
  perp /= l;
  return normalize(dir * cos(ang) + perp * sin(ang));
}

// sparse single-pixel stars; the brightest bleed into a small plus
float stars(vec3 d, float pixA) {
  vec3 p = d * 90.0;
  vec3 id = floor(p);
  if (hash13(id) > 0.16) return 0.0;
  vec3 q = fract(p) - (0.3 + 0.4 * hash33(id));
  float mag = pow(hash13(id + 7.31), 4.0);
  float R = pixA * 90.0 * (0.6 + 0.6 * mag);
  return (0.8 + 2.8 * mag) * exp(-dot(q, q) / (R * R));
}

// Disk: returns (value, hot, alpha) for gas at hit point p, ray along v
vec3 disk(vec3 p, vec3 v, float r) {
  float phi = atan(p.z, p.x);
  float a = phi + 0.9 * pow(r, -1.5) * u_time;  // Lagrangian angle of the gas
  float ca = cos(a), sa = sin(a);
  float streak = fbm(vec3(ca * 2.2, sa * 2.2, r * 1.35));
  float x = R_IN / r;
  float dens = pow(x, 1.6) * smoothstep(R_IN - 0.05, R_IN + 0.3, r) * (0.3 + 1.3 * streak * streak);

  // Doppler beaming x gravitational redshift
  vec3 vdir = vec3(p.z, 0.0, -p.x) / r;
  float beta = sqrt(0.5 / max(r - 1.0, 0.6));
  float gamma = inversesqrt(1.0 - beta * beta);
  float D = 1.0 / (gamma * (1.0 - beta * dot(vdir, -normalize(v))));
  float g = D * sqrt(1.0 - 1.0 / r);
  float I = dens * g * g * g * 1.7;

  float hot = smoothstep(R_IN + 1.2, R_IN + 0.15, r) * smoothstep(0.7, 1.15, g);
  float alpha = smoothstep(R_OUT, R_OUT - 4.5, r) * smoothstep(R_IN - 0.05, R_IN + 0.12, r);
  return vec3(I, hot, alpha);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_center) / u_radius;
  float pixA = FOV / u_radius;

  float el = u_cam.x, az = u_cam.y;
  vec3 ro = CAM_DIST * vec3(cos(el) * sin(az), sin(el), -cos(el) * cos(az));
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  float cr = cos(ROLL), sr = sin(ROLL);
  vec3 rt2 = rt * cr + up * sr;
  vec3 up2 = up * cr - rt * sr;
  vec3 rd = normalize(fw + FOV * (uv.x * rt2 + uv.y * up2));

  vec3 skyDir = rd;
  float captured = 0.0;
  float minR = 1e4;

  // disk layers composited front to back
  float dVal = 0.0, dHot = 0.0, trans = 1.0;

  float b = length(cross(ro, rd));
  float tc = -dot(ro, rd);

  if (b > B_TH || tc < 0.0) {
    skyDir = bendToward(rd, ro, tc > 0.0 ? 2.0 / b : 0.0);
  } else {
    float s0 = sqrt(R_MARCH * R_MARCH - b * b);
    vec3 pos = ro + rd * (tc - s0);
    vec3 vel = bendToward(rd, pos, tailAngle(b, R_MARCH));
    vec3 hv = cross(pos, vel);
    float h2 = dot(hv, hv);
    float r = length(pos);
    vec3 acc = -1.5 * h2 * pos / (r * r * r * r * r);
    bool escaped = false;

    for (int i = 0; i < MAX_STEPS; i++) {
      r = length(pos);
      minR = min(minR, r);
      if (r < 1.0) break;
      if (r > R_MARCH + 0.5 && dot(pos, vel) > 0.0) { escaped = true; break; }

      float hs = H_STEP * r;
      vec3 vh = vel + acc * (0.5 * hs);
      vec3 np = pos + vh * hs;
      float nr = length(np);
      vec3 nacc = -1.5 * h2 * np / (nr * nr * nr * nr * nr);
      vel = vh + nacc * (0.5 * hs);

      if (pos.y * np.y < 0.0) {
        vec3 hp = mix(pos, np, pos.y / (pos.y - np.y));
        float rr = length(hp.xz);
        if (rr > R_IN - 0.05 && rr < R_OUT) {
          vec3 e = disk(hp, vel, rr);
          float a = e.z * 0.97;
          dVal += trans * a * e.x;
          dHot += trans * a * e.y;
          trans *= 1.0 - a;
          if (trans < 0.03) break;
        }
      }
      pos = np;
      acc = nacc;
    }

    if (escaped) {
      float bh = sqrt(h2) / length(vel);
      skyDir = bendToward(normalize(vel), pos, tailAngle(bh, length(pos)));
    } else {
      captured = 1.0;
    }
  }

  // sky: stars, a faint dust band, the Einstein-ring source, photon ring
  float sky = 0.0;
  if (captured < 0.5) {
    sky += stars(skyDir, pixA);
    vec3 bd = vec3(skyDir.x, 0.8 * skyDir.y + 0.6 * skyDir.z, -0.6 * skyDir.y + 0.8 * skyDir.z);
    float blat = 0.6 * bd.x + 0.8 * bd.y;
    float band = exp(-blat * blat / 0.04);
    if (band > 0.03) sky += band * smoothstep(0.35, 0.85, fbm(bd * 3.1 + 4.0)) * 0.16;
    vec3 dS = skyDir - u_src;
    float srcR = max(0.005, pixA * 0.45);
    // capped on the text side, so the fade there can dim the ring
    float fk = smoothstep(u_fade.z, u_fade.w, dot(gl_FragCoord.xy / u_res, u_fade.xy));
    sky += min(exp(-dot(dS, dS) / (srcR * srcR)) * 1.5 * (0.005 * 0.005) / (srcR * srcR), mix(0.9, 50.0, fk * fk));
    sky += exp(-max(minR - 1.5, 0.0) * 7.0) * 0.5;
    sky *= smoothstep(3.4, 1.0, length(uv * vec2(0.8, 1.0))) * 0.6 + 0.4;
  }

  float v = dVal + trans * sky;
  // fade towards the text, dithered like everything else
  v *= mix(0.2, 1.0, smoothstep(u_fade.z, u_fade.w, dot(gl_FragCoord.xy / u_res, u_fade.xy)));

  // quantize to ink / grey1 / grey2 / bone with ordered dithering
  float th = bayer4(gl_FragCoord.xy) + 1.0 / 32.0;
  vec3 col;
  float x = clamp(v, 0.0, 1.0);
  if (x < 0.14) {
    col = x / 0.14 > th ? GREY1 : INK;
  } else if (x < 0.4) {
    col = (x - 0.14) / 0.26 > th ? GREY2 : GREY1;
  } else {
    col = (x - 0.4) / 0.5 > th ? BONE : GREY2;
  }
  // ember: only where the inner edge is hot and lit
  if (dHot * smoothstep(0.15, 0.6, v) * 1.4 > th) col = EMBER;

  gl_FragColor = vec4(col, 1.0);
}
`;

const TARGET = 320; // internal pixels along the long side
const FRAME_MS = 1000 / 30;
const T0 = 45; // seconds of disk evolution before the first frame
const EL_MID = 0.166; // 9.5° above the disk plane (inclination 80.5°)
const EL_AMP = 0.096; // ± 5.5°: inclination drifts between 75° and 86°
const EL_PERIOD = 40; // s
const AZ_RATE = 0.035; // rad/s: slow orbit; fast enough to see the stars stream past the ring

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("[blackhole] shader:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/**
 * Start the renderer. Returns a cleanup function, or null when WebGL is not
 * available (the caller keeps its static fallback).
 */
export function mountBlackHole(opts: BlackHoleOptions): (() => void) | null {
  const { canvas, overlay, anchor, root, onReady, onFail, onFrame } = opts;

  let ctx: WebGLRenderingContext | null = null;
  try {
    const attrs: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    };
    ctx =
      (canvas.getContext("webgl", attrs) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl", attrs) as WebGLRenderingContext | null);
  } catch (err) {
    console.error("[blackhole] no WebGL:", err);
    ctx = null;
  }
  if (!ctx) return null;
  const gl = ctx;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, "a_pos");
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("[blackhole] link:", gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const uCenter = gl.getUniformLocation(prog, "u_center");
  const uRadius = gl.getUniformLocation(prog, "u_radius");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uCam = gl.getUniformLocation(prog, "u_cam");
  const uSrc = gl.getUniformLocation(prog, "u_src");
  const uFade = gl.getUniformLocation(prog, "u_fade");
  const uRes = gl.getUniformLocation(prog, "u_res");

  const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fineMq = window.matchMedia("(hover: hover) and (pointer: fine)");
  const stats = new URLSearchParams(location.search).has("fps") ? makeOverlay() : null;

  let center: [number, number] = [0, 0];
  let radius = 1;
  let scale = 1;
  let fade = [1, 0, 0.15, 0.5];
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

  let visible = true;
  let raf = 0;
  let last = 0;
  let lastDraw = -1e9;
  let clock = T0;
  let frameDt = 0;
  let ready = false;
  let lost = false;

  function measure() {
    const hr = root.getBoundingClientRect();
    const w = Math.max(1, hr.width);
    const h = Math.max(1, hr.height);
    // integer upscale factor so the long side is about TARGET pixels
    const k = Math.max(2, Math.round(Math.max(w, h) / TARGET));
    const bw = Math.ceil(w / k);
    const bh = Math.ceil(h / k);
    for (const c of overlay ? [canvas, overlay] : [canvas]) {
      if (c.width !== bw || c.height !== bh) {
        c.width = bw;
        c.height = bh;
      }
      c.style.width = `${bw * k}px`;
      c.style.height = `${bh * k}px`;
    }
    scale = k;
    const ar = anchor.getBoundingClientRect();
    // centre on a pixel centre so the shadow is symmetric
    center = [
      Math.floor((ar.left + ar.width / 2 - hr.left) / k) + 0.5,
      Math.floor(bh - (ar.top + ar.height / 2 - hr.top) / k) + 0.5,
    ];
    // the anchor is the unit circle; --bh-zoom on it enlarges the render only
    const zoom = parseFloat(getComputedStyle(anchor).getPropertyValue("--bh-zoom")) || 1;
    radius = Math.max(1, (ar.width / 2 / k) * zoom);
    // wide: text on the left; narrow: text at the bottom
    fade = w >= 768 ? [1, 0, 0.12, 0.5] : [0, 1, 0.12, 0.55];
  }

  function draw() {
    if (lost) return;
    const t0 = stats ? performance.now() : 0;
    const still = reduceMq.matches;
    const el0 = still ? EL_MID : EL_MID + EL_AMP * Math.sin((2 * Math.PI * clock) / EL_PERIOD);
    const az0 = still ? 0 : AZ_RATE * (clock - T0);
    const el = el0 + tilt.y * 0.05;
    const az = az0 + tilt.x * 0.09;
    // the source sits behind the hole for the drifting camera; the pointer
    // tilt then visibly bends and breaks the Einstein ring
    const src: V3 = [-Math.cos(el0) * Math.sin(az0), -Math.sin(el0), Math.cos(el0) * Math.cos(az0)];
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uCenter, center[0], center[1]);
    gl.uniform1f(uRadius, radius);
    gl.uniform4f(uFade, fade[0], fade[1], fade[2], fade[3]);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, clock);
    gl.uniform2f(uCam, el, az);
    gl.uniform3f(uSrc, src[0], src[1], src[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    onFrame?.({
      el,
      az,
      src,
      center,
      radius,
      width: canvas.width,
      height: canvas.height,
      scale,
      dt: frameDt,
      still,
    });
    frameDt = 0;
    if (stats) {
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      stats.frame(performance.now() - t0, canvas.width, canvas.height);
    }
    if (!ready) {
      ready = true;
      requestAnimationFrame(() => onReady?.());
    }
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    clock += dt;
    frameDt += dt;
    const k = Math.min(1, dt * 2.2);
    tilt.x += (tilt.tx - tilt.x) * k;
    tilt.y += (tilt.ty - tilt.y) * k;
    if (now - lastDraw >= FRAME_MS - 2) {
      lastDraw = now;
      draw();
    }
    schedule();
  }

  function running() {
    return visible && !document.hidden && !reduceMq.matches && !lost;
  }

  function schedule() {
    if (!raf && running()) raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  }

  function refresh() {
    measure();
    if (reduceMq.matches) {
      stop();
      tilt.x = tilt.y = tilt.tx = tilt.ty = 0;
      clock = T0;
    }
    draw();
    schedule();
  }

  const onPointer = (e: PointerEvent) => {
    if (!fineMq.matches || e.pointerType !== "mouse") return;
    tilt.tx = (e.clientX / window.innerWidth) * 2 - 1;
    tilt.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  const onScroll = () => {
    if (fineMq.matches) return;
    const h = root.offsetHeight || window.innerHeight;
    const p = Math.min(1, Math.max(0, window.scrollY / h));
    tilt.ty = p * 1.6;
    tilt.tx = p * 0.5;
  };
  const onVisibility = () => (document.hidden ? stop() : schedule());
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    stop();
    onFail?.();
  };

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) schedule();
      else stop();
    },
    { rootMargin: "80px" },
  );
  io.observe(root);

  const ro = new ResizeObserver(() => refresh());
  ro.observe(root);
  ro.observe(anchor);

  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);
  reduceMq.addEventListener?.("change", refresh);

  refresh();

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onLost);
    reduceMq.removeEventListener?.("change", refresh);
    stats?.remove();
  };
}

function makeOverlay() {
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:fixed;left:8px;bottom:8px;z-index:300;padding:4px 8px;font:11px/1.4 var(--f-mono,monospace);" +
    "color:#ece6da;background:#0a0908;border:2px solid #3a3733;pointer-events:none;white-space:pre";
  document.body.appendChild(el);
  const draws: number[] = [];
  const gaps: number[] = [];
  let lastT = 0;
  const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
  return {
    frame(ms: number, w: number, h: number) {
      const now = performance.now();
      if (lastT) gaps.push(now - lastT);
      lastT = now;
      draws.push(ms);
      if (draws.length > 30) draws.shift();
      if (gaps.length > 30) gaps.shift();
      const g = avg(gaps);
      el.textContent = `frame ${avg(draws).toFixed(1)} ms · ${g ? (1000 / g).toFixed(0) : "-"} fps\n${w}×${h} px`;
    },
    remove() {
      el.remove();
    },
  };
}
