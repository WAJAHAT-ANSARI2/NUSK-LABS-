import { useEffect, useRef } from "react";

const CHARS = "01ABCDEF<>{}[]/#$%";
const SIZE = 14;

// Fixed full-screen code rain behind the page. Columns near the cursor fall faster and glow white.
export default function MatrixRain() {
  const ref = useRef();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const cv = ref.current;
    const cx = cv.getContext("2d");
    let W, H, cols, drops, raf, mx = -999, my = -999;

    const fit = () => {
      W = cv.width = innerWidth;
      H = cv.height = innerHeight;
      cols = Math.ceil(W / SIZE);
      drops = Array.from({ length: cols }, () => (Math.random() * H) / SIZE);
    };
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    fit();
    addEventListener("resize", fit);
    addEventListener("pointermove", move);

    const loop = () => {
      const day = document.documentElement.classList.contains("day");
      cx.fillStyle = day ? "rgba(247,240,238,.13)" : "rgba(7,3,4,.13)";
      cx.fillRect(0, 0, W, H);
      cx.font = SIZE + "px ui-monospace,Menlo,monospace";
      for (let i = 0; i < cols; i++) {
        const x = i * SIZE, y = drops[i] * SIZE;
        const near = Math.hypot(x - mx, y - my) < 130;
        cx.fillStyle = near ? "#fff" : "#ff2a3d";
        cx.globalAlpha = near ? 0.95 : 0.55;
        cx.fillText(CHARS[(Math.random() * CHARS.length) | 0], x, y);
        drops[i] += near ? 1.3 : 0.28;
        if (y > H && Math.random() > 0.975) drops[i] = 0;
      }
      cx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", fit);
      removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} className="rain" aria-hidden="true" />;
}
