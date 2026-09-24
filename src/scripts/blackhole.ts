/**
 * Real-time Schwarzschild black hole, drawn like an engraved astronomical
 * plate. WebGL1 fragment shader, no dependencies.
 *
 * Physics (units: Schwarzschild radius r_s = 1):
 *   Null geodesics are integrated with the classic Newtonian-form trick
 *     d²x/dλ² = -3/2 · h² · x / r⁵,   h = |x × dx/dλ|  (conserved)
 *   which reproduces the exact Schwarzschild photon orbit equation
 *   u'' + u = 3/2 u², so the photon sphere sits at r = 1.5 and the shadow
 *   edge at impact parameter b = 3√3/2 ≈ 2.598.
 *   Rays that stay far from the hole (b > 15) use the weak-field deflection
 *   2/b analytically; marched rays get the tiny deflection outside the
 *   marching sphere added back in closed form, so the two regimes meet
 *   without a seam.
 *   The disk is geometrically thin, in the y = 0 plane, from the ISCO
 *   (r = 3) outwards, Keplerian (β = √(½ / (r − 1))), with Doppler beaming
 *   and gravitational redshift g = D · √(1 − 1/r), intensity ∝ g³.
 *
 * Look: disk and Milky band are rendered as engraved hairlines whose
 * thickness encodes brightness; the sky carries a 15° graticule so the
 * lensing is legible; a small source directly behind the hole produces an
 * Einstein ring.
 */

export interface BlackHoleOptions {
  /** canvas that covers `root` */
  canvas: HTMLCanvasElement;
  /** element whose border box defines the unit circle the hole is drawn in */
  anchor: HTMLElement;
  /** the section; used for visibility, resize and parallax */
  root: HTMLElement;
  /** called after the first frame is on screen */
  onReady?: () => void;
  /** called if the context is lost after start */
  onFail?: () => void;
}

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

uniform vec2 u_center;   // hole centre, drawing-buffer px (GL origin)
uniform float u_radius;  // px per unit of screen uv
uniform float u_time;
uniform vec2 u_tilt;     // parallax, -1..1

#ifdef HAS_DERIV
#define FW(x, est) fwidth(x)
#else
#define FW(x, est) (est)
#endif

const float PI = 3.14159265;
const int MAX_STEPS = 170;
const float R_IN = 3.0;      // ISCO
const float R_OUT = 12.5;
const float R_MARCH = 30.0;  // numerical integration inside this sphere
const float B_TH = 15.0;     // beyond this impact parameter: weak field
const float CAM_DIST = 34.0;
const float FOV = 0.34;      // tan(half-angle) per uv unit
const float EL0 = 0.15;      // camera elevation above the disk plane (rad)
const float ROLL = -0.12;
const float LINE_SP = 0.115; // engraved line spacing on the disk (r_s)
const float HATCH_SP = 0.0048; // hatch spacing on the sky (rad)

const vec3 INK = vec3(0.039, 0.035, 0.031);
const vec3 BONE = vec3(0.925, 0.902, 0.855);
const vec3 ASH = vec3(0.604, 0.580, 0.541);
const vec3 EMBER = vec3(0.878, 0.267, 0.180);

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
  for (int i = 0; i < 4; i++) {
    s += a * noise3(p);
    p = p * 2.03 + 11.7;
    a *= 0.5;
  }
  return s;
}

// Remaining weak-field deflection of a ray with impact parameter b from
// radius r out to infinity (integral of the 1/r^5 law along a straight line).
float tailAngle(float b, float r) {
  float s = sqrt(max(1.0 - b * b / (r * r), 0.0));
  return (1.0 - 1.5 * s + 0.5 * s * s * s) / max(b, 1e-3);
}

// Rotate dir towards the centre (origin) by ang, in the plane of pos & dir.
vec3 bendToward(vec3 dir, vec3 pos, float ang) {
  vec3 perp = -pos + dot(pos, dir) * dir;
  float l = length(perp);
  if (l < 1e-6) return dir;
  perp /= l;
  return normalize(dir * cos(ang) + perp * sin(ang));
}

// Anti-aliased engraved line: lines at integer+0.5 of u, local coverage cov.
float engrave(float u, float cov, float w) {
  float d = abs(fract(u) - 0.5);
  float hw = 0.5 * cov;
  float ink = 1.0 - smoothstep(hw - 0.5 * w, hw + 0.5 * w + 1e-4, d);
  // when lines are smaller than a pixel, fall back to their mean coverage
  return mix(ink, cov, smoothstep(0.22, 0.55, w));
}

float starLayer(vec3 d, float scale, float density, float pixA) {
  vec3 p = d * scale;
  vec3 id = floor(p);
  if (hash13(id) > density) return 0.0;
  vec3 o = 0.3 + 0.4 * hash33(id);
  vec3 q = fract(p) - o;
  float mag = pow(hash13(id + 7.31), 7.0);
  float rad = 0.07 + 0.12 * mag;          // intrinsic size, cell units
  float R = max(rad, pixA * scale * 0.75); // never smaller than a pixel
  float k = (rad * rad) / (R * R);         // flux conservation when smeared
  return (0.22 + 1.5 * mag) * k * exp(-dot(q, q) / (R * R));
}

// Accretion disk emission at hit point p for a ray travelling along v.
// Returns rgb tint in .rgb and intensity in .a
vec4 diskEmission(vec3 p, vec3 v, float r) {
  float phi = atan(p.z, p.x);
  float omega = 0.9 * pow(r, -1.5);
  float a = phi + omega * u_time;  // Lagrangian angle of the gas
  float ca = cos(a), sa = sin(a);
  // streaks: long in azimuth, short in radius
  float streak = fbm(vec3(ca * 2.2, sa * 2.2, r * 1.35));
  float fine = noise3(vec3(ca * 7.0, sa * 7.0, r * 5.0));
  float x = R_IN / r;
  float prof = pow(x, 1.7) * smoothstep(R_IN - 0.05, R_IN + 0.3, r);
  float dens = prof * (0.25 + 1.2 * streak * streak + 0.35 * fine);

  // Doppler beaming + gravitational redshift
  vec3 vdir = vec3(p.z, 0.0, -p.x) / r;
  float beta = sqrt(0.5 / max(r - 1.0, 0.6));
  float gamma = inversesqrt(1.0 - beta * beta);
  float cosT = dot(vdir, -normalize(v));
  float D = 1.0 / (gamma * (1.0 - beta * cosT));
  float g = D * sqrt(1.0 - 1.0 / r);
  float I = dens * pow(g, 3.0) * 1.35;

  float hot = smoothstep(R_IN + 1.3, R_IN + 0.1, r) * smoothstep(0.55, 1.1, g);
  vec3 tint = mix(ASH, BONE, smoothstep(9.0, 4.0, r) * 0.7 + 0.3 * smoothstep(0.6, 1.3, g));
  tint = mix(tint, EMBER * 1.1, hot);
  return vec4(tint, I);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_center) / u_radius;
  float pixEst = FOV / u_radius;

  // camera
  float el = EL0 + u_tilt.y * 0.05;
  float az = u_tilt.x * 0.08;
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

  // front-most disk hit (engraved), plus anything seen through it (smooth)
  bool hadFirst = false;
  float dR = 0.0, dCov = 0.0, dA = 0.0, dBright = 0.0;
  vec3 dTint = vec3(0.0);
  vec3 accC = vec3(0.0);
  float accA = 0.0;

  float b = length(cross(ro, rd));
  float tc = -dot(ro, rd);

  if (b > B_TH || tc < 0.0) {
    // weak field: total deflection 2 r_s / b
    float ang = tc > 0.0 ? 2.0 / b : 0.0;
    skyDir = bendToward(rd, ro, ang);
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

      float hs = 0.065 * r;
      vec3 vh = vel + acc * (0.5 * hs);
      vec3 np = pos + vh * hs;
      float nr = length(np);
      vec3 nacc = -1.5 * h2 * np / (nr * nr * nr * nr * nr);
      vel = vh + nacc * (0.5 * hs);

      if (pos.y * np.y < 0.0) {
        vec3 hp = mix(pos, np, pos.y / (pos.y - np.y));
        float rr = length(hp.xz);
        if (rr > R_IN - 0.05 && rr < R_OUT) {
          vec4 e = diskEmission(hp, vel, rr);
          float alpha = 0.96 * smoothstep(R_OUT, R_OUT - 4.5, rr)
                             * smoothstep(R_IN - 0.05, R_IN + 0.12, rr);
          float cov = 1.0 - exp(-e.a * 1.5);
          float bright = 0.55 + 0.6 * min(e.a, 1.6);
          if (!hadFirst) {
            hadFirst = true;
            dR = rr; dCov = cov; dA = alpha; dTint = e.rgb; dBright = bright;
          } else {
            vec3 c = e.rgb * cov * bright;
            accC += (1.0 - accA) * alpha * c;
            accA += (1.0 - accA) * alpha;
          }
          if ((1.0 - dA) * (1.0 - accA) < 0.02) break;
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

  // ---- everything below runs in uniform control flow (derivatives) ----

  float pixA = pixEst;
#ifdef HAS_DERIV
  pixA = max(length(fwidth(skyDir)), pixEst * 0.5);
#endif

  // celestial frame for the graticule
  float c1 = cos(0.42), s1 = sin(0.42), c2 = cos(0.7), s2 = sin(0.7);
  vec3 cd = vec3(skyDir.x, c1 * skyDir.y - s1 * skyDir.z, s1 * skyDir.y + c1 * skyDir.z);
  cd = vec3(c2 * cd.x + s2 * cd.z, cd.y, -s2 * cd.x + c2 * cd.z);
  float lat = asin(clamp(cd.y, -1.0, 1.0));
  float lonA = atan(cd.z, cd.x);
  float lonB = atan(-cd.z, -cd.x);
  float step15 = PI / 12.0;
  float gLat = lat / step15;
  float wLat = FW(gLat, pixEst / step15);
  float lineLat = 1.0 - smoothstep(0.35 * wLat, 1.25 * wLat, abs(fract(gLat + 0.5) - 0.5));
  lineLat *= 1.0 - smoothstep(0.12, 0.35, wLat);
  float gLon = lonA / step15;
#ifdef HAS_DERIV
  float wLon = min(fwidth(lonA), fwidth(lonB)) / step15;
#else
  float wLon = pixEst / step15 / max(cos(lat), 0.05);
#endif
  float lineLon = 1.0 - smoothstep(0.35 * wLon, 1.25 * wLon, abs(fract(gLon + 0.5) - 0.5));
  lineLon *= (1.0 - smoothstep(0.12, 0.35, wLon)) * smoothstep(0.97, 0.85, abs(cd.y));
  float grat = max(lineLat, lineLon);

  // Milky band in its own frame, drawn as engraved hatching
  vec3 bd = vec3(skyDir.x, 0.8 * skyDir.y + 0.6 * skyDir.z, -0.6 * skyDir.y + 0.8 * skyDir.z);
  bd = vec3(0.6 * bd.x - 0.8 * bd.y, 0.8 * bd.x + 0.6 * bd.y, bd.z);
  float blat = asin(clamp(bd.y, -1.0, 1.0));
  float hu = blat / HATCH_SP;
  float wHu = FW(hu, pixEst / HATCH_SP);
  float band = exp(-blat * blat / 0.045);
  float milky = 0.0;
  if (band > 0.02) {
    float n = fbm(bd * 3.1 + 4.0);
    milky = band * smoothstep(0.3, 0.8, n) * 1.25;
  }
  float hatch = engrave(hu, clamp(milky, 0.0, 1.0), wHu);

  // stars
  float stars = starLayer(skyDir, 90.0, 0.10, pixA)
              + starLayer(skyDir, 210.0, 0.14, pixA) * 0.7
              + starLayer(skyDir, 420.0, 0.10, pixA) * 0.45;

  // compact source straight behind the hole: its image is the Einstein ring
  vec3 S = vec3(0.0, -sin(EL0), cos(EL0));
  vec3 dS = skyDir - S;
  float srcR = max(0.009, pixA);
  float src = exp(-dot(dS, dS) / (srcR * srcR)) * (0.009 * 0.009) / (srcR * srcR);

  float plate = smoothstep(2.9, 0.8, length(uv * vec2(0.85, 1.0)));
  vec3 skyC = BONE * stars * mix(0.55, 1.0, plate)
            + ASH * (grat * 0.075 * plate + hatch * 0.17 * mix(0.35, 1.0, plate))
            + BONE * src * 0.4;
  skyC *= 1.0 - captured;

  // photon ring: rays that skimmed the photon sphere at r = 1.5
  float pr = captured > 0.5 ? 0.0 : exp(-max(minR - 1.5, 0.0) * 9.0);
  skyC += BONE * pr * 0.32;

  vec3 col = INK + skyC;
  col = accC + (1.0 - accA) * col;

  // engraved front disk
  float lu = dR / LINE_SP;
  float wLu = FW(lu, 0.5);
  float lit = engrave(lu, dCov, wLu);
  vec3 dCol = INK + dTint * lit * dBright;
  col = mix(col, dCol, dA);

  // gentle roll-off and dither
  col = col / (1.0 + max(col - 0.9, 0.0));
  col += (hash13(vec3(gl_FragCoord.xy, 3.1)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("[blackhole] shader:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

const MAX_PIXELS = 1.6e6; // drawing-buffer budget before adaptive scaling
const T0 = 45; // seconds of disk evolution before the first frame

/**
 * Start the renderer. Returns a cleanup function, or null when WebGL is not
 * available (the caller keeps its static fallback).
 */
export function mountBlackHole(opts: BlackHoleOptions): (() => void) | null {
  const { canvas, anchor, root, onReady, onFail } = opts;

  let gl: WebGLRenderingContext | null = null;
  try {
    const attrs: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    };
    gl =
      (canvas.getContext("webgl", attrs) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl", attrs) as WebGLRenderingContext | null);
  } catch {
    gl = null;
  }
  if (!gl) return null;

  const deriv = gl.getExtension("OES_standard_derivatives");
  const header = deriv ? "#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIV 1\n" : "";
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, header + FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[blackhole] link:", gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uCenter = gl.getUniformLocation(prog, "u_center");
  const uRadius = gl.getUniformLocation(prog, "u_radius");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uTilt = gl.getUniformLocation(prog, "u_tilt");

  const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fineMq = window.matchMedia("(hover: hover) and (pointer: fine)");

  let quality = 1; // adaptive multiplier on the drawing-buffer scale
  let scale = 1;
  let center = [0, 0];
  let radius = 1;
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

  let visible = true;
  let raf = 0;
  let last = 0;
  let clock = T0;
  let ready = false;
  let lost = false;
  let frames = 0;
  let slowAcc = 0;

  function measure() {
    const cr = canvas.getBoundingClientRect();
    const w = Math.max(1, cr.width);
    const h = Math.max(1, cr.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let s = dpr * quality;
    const px = w * h * s * s;
    if (px > MAX_PIXELS) s *= Math.sqrt(MAX_PIXELS / px);
    scale = s;
    const bw = Math.max(1, Math.round(w * s));
    const bh = Math.max(1, Math.round(h * s));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    const ar = anchor.getBoundingClientRect();
    const cx = (ar.left + ar.width / 2 - cr.left) * (bw / w);
    const cy = (cr.bottom - (ar.top + ar.height / 2)) * (bh / h);
    center = [cx, cy];
    radius = Math.max(1, (ar.width / 2) * (bw / w));
  }

  function draw() {
    if (!gl || lost) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uCenter, center[0], center[1]);
    gl.uniform1f(uRadius, radius);
    gl.uniform1f(uTime, clock);
    gl.uniform2f(uTilt, tilt.x, tilt.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!ready) {
      ready = true;
      // wait for the frame to actually reach the screen
      requestAnimationFrame(() => onReady?.());
    }
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    clock += dt;
    const k = Math.min(1, dt * 2.2);
    tilt.x += (tilt.tx - tilt.x) * k;
    tilt.y += (tilt.ty - tilt.y) * k;

    // adaptive resolution: if frames are consistently slow, render smaller
    frames++;
    if (frames > 8 && dt > 0) {
      slowAcc = slowAcc * 0.9 + (dt > 1 / 32 ? 1 : 0) * 0.1;
      if (slowAcc > 0.6 && quality > 0.45) {
        quality *= 0.8;
        slowAcc = 0;
        measure();
      }
    }
    draw();
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
    stop();
    measure();
    if (reduceMq.matches) {
      tilt.x = tilt.y = tilt.tx = tilt.ty = 0;
      draw();
    } else {
      draw();
      schedule();
    }
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
  };
}
