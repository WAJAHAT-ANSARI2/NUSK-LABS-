import { useEffect } from "react";

// Mouse parallax variables, 3D tilt + spotlight on .card, and spotlight on .pn panels.
export default function usePointerEffects() {
  useEffect(() => {
    const root = document.documentElement.style;

    const move = (e) => {
      root.setProperty("--px", (e.clientX / innerWidth - 0.5).toFixed(3));
      root.setProperty("--py", (e.clientY / innerHeight - 0.5).toFixed(3));

      const panel = e.target.closest?.(".pn");
      if (panel) {
        const r = panel.getBoundingClientRect();
        panel.style.setProperty("--mx", e.clientX - r.left + "px");
        panel.style.setProperty("--my", e.clientY - r.top + "px");
      }

      const card = e.target.closest?.(".card");
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
        card.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 12}deg) translateY(-6px)`;
      }
    };

    const leave = (e) => {
      const card = e.target.closest?.(".card");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    };

    addEventListener("pointermove", move);
    addEventListener("pointerout", leave);
    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerout", leave);
    };
  }, []);
}
