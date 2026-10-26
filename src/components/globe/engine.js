import { NODES } from "../../data/nodes";
import { ll, sunVec, mkTex, TW, TH } from "../../lib/geo";

const TAU = Math.PI * 2;
// Orbit rings: [radius multiplier, tilt, rotation, satellite speed]
const ORBITS = [
  [1.28, 0.38, -0.5, 0.012],
  [1.45, 0.55, 0.9, -0.008],
  [1.62, 0.28, 2.1, 0.016],
];

const ringPoint = (Ro, tilt, rot, a) => {
  const px = Ro * Math.cos(a);
  const py = Ro * Math.sin(a) * Math.sin(tilt);
  const depth = Math.sin(a) * Math.cos(tilt);
  const cs = Math.cos(rot);
  const sn = Math.sin(rot);
  return [px * cs - py * sn, px * sn + py * cs, depth];
};

/**
 * Canvas "holographic" globe: dot-matrix continents, grid, orbit rings, live attack arcs.
 * Dragging/pausing it makes the whole site follow day/night at the place it faces.
 * Returns a cleanup function.
 */
export function createGlobe(cv, { autoRef, onUserStop, onCount, onLabel }) {
  const cx = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  let S = 0, raf = 0, t = 0;
  let ry = -0.6, rx = 0.35, vy = reduce ? 0 : 0.0035;
  let drag = false, lx = 0, ly = 0, moved = 0;
  let hov = -1, mx = -999, my = -999;
  let blocked = 0, dayNow = false;

  const fit = () => {
    const r = cv.getBoundingClientRect();
    S = r.width;
    cv.width = S * dpr;
    cv.height = S * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  fit();
  addEventListener("resize", fit);

  // ---- static data -------------------------------------------------------
  const TEX = mkTex();
  const dots = []; // evenly spread points on the sphere, flagged land/ocean
  const N = 2600;
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.39996;
    const p = [Math.cos(a) * r, y, Math.sin(a) * r];
    const la = Math.asin(y);
    const lo = Math.atan2(p[0], p[2]);
    const v = Math.min(TH - 1, (((Math.PI / 2 - la) / Math.PI) * TH) | 0);
    const u = Math.min(TW - 1, (((lo + Math.PI) / TAU) * TW) | 0);
    dots.push([p, TEX[v * TW + u] > 127]);
  }
  const nv = NODES.map((n) => ll(n[1], n[2]));
  const hits = NODES.map(() => 0);
  const arcs = [];
  const rings = [];

  // ---- helpers -----------------------------------------------------------
  const rot = (v) => {
    const cy = Math.cos(ry), sy = Math.sin(ry), cr = Math.cos(rx), sr = Math.sin(rx);
    const x = v[0] * cy + v[2] * sy;
    const z = -v[0] * sy + v[2] * cy;
    return [x, v[1] * cr - z * sr, v[1] * sr + z * cr];
  };
  const spawn = (a, b) => {
    if (a !== b) arcs.push({ a, b, t: 0, sp: 0.007 + Math.random() * 0.007 });
  };
  const rn = () => (Math.random() * nv.length) | 0;

  const drawRings = (R, c, front) => {
    ORBITS.forEach(([k, tilt, rt, sp], i) => {
      cx.beginPath();
      let pen = false;
      for (let d = 0; d <= 90; d++) {
        const q = ringPoint(R * k, tilt, rt, (d / 90) * TAU);
        if (q[2] >= 0 === front) {
          const X = c + q[0], Y = c - q[1];
          pen ? cx.lineTo(X, Y) : cx.moveTo(X, Y);
          pen = true;
        } else pen = false;
      }
      cx.strokeStyle = front ? "rgba(255,110,120,.5)" : "rgba(255,110,120,.16)";
      cx.lineWidth = front ? 1.2 : 0.8;
      cx.stroke();

      const s = ringPoint(R * k, tilt, rt, t * sp * 2 + i * 2.1); // satellite
      if (s[2] >= 0 === front) {
        cx.shadowColor = "#ff2a3d";
        cx.shadowBlur = 14;
        cx.fillStyle = "#fff";
        cx.beginPath();
        cx.arc(c + s[0], c - s[1], 3.2, 0, TAU);
        cx.fill();
        cx.shadowBlur = 0;
      }
    });
  };

  const drawGlobe = (R, c, SUN) => {
    const sv = rot(SUN);
    drawRings(R, c, false);

    // glassy body, lit from the sun's side
    const body = cx.createRadialGradient(c + sv[0] * R * 0.5, c - sv[1] * R * 0.5, R * 0.08, c, c, R);
    body.addColorStop(0, "rgba(255,96,80,.4)");
    body.addColorStop(0.55, "rgba(90,12,28,.55)");
    body.addColorStop(1, "rgba(18,3,10,.9)");
    cx.fillStyle = body;
    cx.beginPath();
    cx.arc(c, c, R, 0, TAU);
    cx.fill();

    // grid lines + moving scan line
    const poly = (f, n) => {
      cx.beginPath();
      let pen = false;
      for (let d = 0; d <= n; d++) {
        const v = rot(f(d / n));
        if (v[2] > 0) {
          const X = c + v[0] * R, Y = c - v[1] * R;
          pen ? cx.lineTo(X, Y) : cx.moveTo(X, Y);
          pen = true;
        } else pen = false;
      }
      cx.stroke();
    };
    cx.lineWidth = 0.7;
    cx.strokeStyle = "rgba(255,100,110,.16)";
    for (let la = -60; la <= 60; la += 30) {
      const l = (la * Math.PI) / 180;
      poly((u) => [Math.cos(l) * Math.sin(u * TAU), Math.sin(l), Math.cos(l) * Math.cos(u * TAU)], 72);
    }
    for (let lo = 0; lo < 180; lo += 30) {
      const o = (lo * Math.PI) / 180;
      poly((u) => [Math.cos(u * TAU) * Math.sin(o), Math.sin(u * TAU), Math.cos(u * TAU) * Math.cos(o)], 72);
    }
    const sl = Math.sin(t * 0.012) * 1.1;
    cx.lineWidth = 1.6;
    cx.strokeStyle = "rgba(255,190,120,.75)";
    cx.shadowColor = "#ff8a3d";
    cx.shadowBlur = 10;
    poly((u) => [Math.cos(sl) * Math.sin(u * TAU), Math.sin(sl), Math.cos(sl) * Math.cos(u * TAU)], 72);
    cx.shadowBlur = 0;

    // land dots (amber on the day side, red on the night side)
    let prevLit = null;
    for (const [p, land] of dots) {
      if (!land) continue;
      const v = rot(p);
      const front = v[2] > 0;
      const lit = p[0] * SUN[0] + p[1] * SUN[1] + p[2] * SUN[2] > 0;
      if (lit !== prevLit) {
        cx.fillStyle = lit ? "#ffb35c" : "#ff3d50";
        prevLit = lit;
      }
      cx.globalAlpha = front ? 0.5 + 0.5 * v[2] : 0.1;
      const s = front ? 2.2 : 1.4;
      cx.fillRect(c + v[0] * R - s / 2, c - v[1] * R - s / 2, s, s);
    }
    // faint ocean dots
    cx.fillStyle = "#ff6b78";
    for (let i = 0; i < dots.length; i += 2) {
      const [p, land] = dots[i];
      if (land) continue;
      const v = rot(p);
      if (v[2] <= 0) continue;
      cx.globalAlpha = 0.1 + 0.14 * v[2];
      cx.fillRect(c + v[0] * R, c - v[1] * R, 1, 1);
    }
    cx.globalAlpha = 1;

    // glowing rim
    cx.strokeStyle = "rgba(255,120,120,.85)";
    cx.lineWidth = 1.6;
    cx.shadowColor = "#ff2a3d";
    cx.shadowBlur = 18;
    cx.beginPath();
    cx.arc(c, c, R, 0, TAU);
    cx.stroke();
    cx.shadowBlur = 0;

    drawRings(R, c, true);
  };

  // ---- main loop ---------------------------------------------------------
  const loop = () => {
    t++;
    const R = S * 0.3, c = S / 2;
    cx.clearRect(0, 0, S, S);

    const halo = cx.createRadialGradient(c, c, R * 0.6, c, c, R * 1.35);
    halo.addColorStop(0, "rgba(255,42,61,.34)");
    halo.addColorStop(0.55, "rgba(255,42,61,.16)");
    halo.addColorStop(1, "rgba(255,42,61,0)");
    cx.fillStyle = halo;
    cx.fillRect(0, 0, S, S);

    // ease rotation toward the target speed (0 when hovering, paused or dragged)
    if (!drag) vy += ((hov >= 0 || reduce || !autoRef.current ? 0 : 0.0035) - vy) * 0.04;
    ry += vy;

    const SUN = sunVec();
    drawGlobe(R, c, SUN);

    // city nodes + hover detection
    hov = -1;
    let best = 18;
    const pn = nv.map((p, i) => {
      const v = rot(p);
      const x = c + v[0] * R, y = c - v[1] * R;
      if (v[2] > 0.05) {
        const d = Math.hypot(x - mx, y - my);
        if (d < best) { best = d; hov = i; }
      }
      return [x, y, v[2]];
    });
    pn.forEach((p, i) => {
      if (p[2] <= 0.05) return;
      const h = i === hov;
      cx.fillStyle = "#fff";
      cx.beginPath();
      cx.arc(p[0], p[1], h ? 5 : 3, 0, TAU);
      cx.fill();
      cx.strokeStyle = "rgba(255,42,61,.85)";
      cx.lineWidth = 1;
      cx.beginPath();
      cx.arc(p[0], p[1], (h ? 10 : 6) + Math.sin(t * 0.05 + i) * 1.5, 0, TAU);
      cx.stroke();
    });

    // which place faces the viewer, and is it day there?
    const fc = [-Math.cos(rx) * Math.sin(ry), Math.sin(rx), Math.cos(rx) * Math.cos(ry)];
    const dd = fc[0] * SUN[0] + fc[1] * SUN[1] + fc[2] * SUN[2];
    if (t % 10 === 0) {
      let bi = 0, bd = -2;
      nv.forEach((p, i) => {
        const q = p[0] * fc[0] + p[1] * fc[1] + p[2] * fc[2];
        if (q > bd) { bd = q; bi = i; }
      });
      onLabel(`Facing: ${NODES[bi][0]} · ${dd > 0 ? "Day ☀" : "Night ☾"}`);
    }
    if (!autoRef.current && dd > 0 !== dayNow) {
      dayNow = dd > 0;
      document.documentElement.classList.toggle("day", dayNow);
    }

    // attacks
    if (!reduce && t % 28 === 0) spawn(rn(), rn());
    for (let k = arcs.length - 1; k >= 0; k--) {
      const A = arcs[k];
      A.t += A.sp;
      const a = nv[A.a], b = nv[A.b];
      const w = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const sn = Math.sin(w) || 1;
      const at = (u) => {
        const s1 = Math.sin((1 - u) * w) / sn, s2 = Math.sin(u * w) / sn;
        const l = 1 + 0.3 * Math.sin(Math.PI * u) * (w / 3.14);
        return rot([(a[0] * s1 + b[0] * s2) * l, (a[1] * s1 + b[1] * s2) * l, (a[2] * s1 + b[2] * s2) * l]);
      };
      const t0 = Math.max(0, A.t - 0.35), t1 = Math.min(1, A.t);
      cx.beginPath();
      for (let s = 0; s <= 20; s++) {
        const v = at(t0 + ((t1 - t0) * s) / 20);
        const X = c + v[0] * R, Y = c - v[1] * R;
        s ? cx.lineTo(X, Y) : cx.moveTo(X, Y);
      }
      cx.shadowColor = "#ff2a3d";
      cx.shadowBlur = 12;
      cx.strokeStyle = "rgba(255,90,100,1)";
      cx.lineWidth = 2.5;
      cx.stroke();
      const hv = at(t1);
      cx.fillStyle = "#fff";
      cx.beginPath();
      cx.arc(c + hv[0] * R, c - hv[1] * R, 3.5, 0, TAU);
      cx.fill();
      cx.shadowBlur = 0;
      if (A.t >= 1) {
        rings.push({ n: A.b, r: 0 });
        hits[A.b]++;
        onCount(++blocked);
        arcs.splice(k, 1);
      }
    }
    for (let k = rings.length - 1; k >= 0; k--) {
      const r = rings[k];
      r.r += 0.4;
      const v = rot(nv[r.n]);
      if (v[2] > 0) {
        const X = c + v[0] * R, Y = c - v[1] * R, al = 1 - r.r / 30;
        cx.strokeStyle = `rgba(255,42,61,${al})`;
        cx.lineWidth = 2;
        cx.beginPath();
        cx.arc(X, Y, r.r, 0, TAU);
        cx.stroke();
        cx.fillStyle = `rgba(255,255,255,${al})`;
        cx.font = "600 10px Chakra Petch,system-ui,sans-serif";
        cx.fillText("BLOCKED", X + 10, Y - 12 - r.r * 0.3);
      }
      if (r.r > 30) rings.splice(k, 1);
    }

    // tooltip
    if (hov >= 0) {
      const p = pn[hov];
      const txt = `${NODES[hov][0]} · ${hits[hov]} blocked`;
      cx.font = "600 13px Chakra Petch,system-ui,sans-serif";
      const w = cx.measureText(txt).width + 20;
      cx.fillStyle = "rgba(10,3,5,.92)";
      cx.strokeStyle = "#ff2a3d";
      cx.lineWidth = 1;
      cx.beginPath();
      cx.roundRect(p[0] + 14, p[1] - 30, w, 26, 6);
      cx.fill();
      cx.stroke();
      cx.fillStyle = "#fff";
      cx.fillText(txt, p[0] + 24, p[1] - 12);
    }
    cv.style.cursor = hov >= 0 ? "pointer" : "";
    raf = requestAnimationFrame(loop);
  };

  // ---- pointer input -----------------------------------------------------
  cv.onpointermove = (e) => {
    const r = cv.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    if (drag) {
      const dx = e.clientX - lx;
      moved += Math.abs(dx) + Math.abs(e.clientY - ly);
      ry += dx * 0.006;
      rx = Math.max(-1, Math.min(1, rx + (e.clientY - ly) * 0.004));
      vy = dx * 0.0008;
      lx = e.clientX;
      ly = e.clientY;
    }
  };
  cv.onpointerdown = (e) => {
    drag = true;
    moved = 0;
    autoRef.current = false;
    onUserStop();
    lx = e.clientX;
    ly = e.clientY;
    cv.setPointerCapture(e.pointerId);
  };
  cv.onpointerup = () => {
    drag = false;
    if (moved < 6 && hov >= 0) for (let i = 0; i < 4; i++) spawn(rn(), hov); // click a city: 4 attacks
  };
  cv.onpointerleave = () => { mx = my = -999; };

  loop();
  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("resize", fit);
    cv.onpointermove = cv.onpointerdown = cv.onpointerup = cv.onpointerleave = null;
  };
}
