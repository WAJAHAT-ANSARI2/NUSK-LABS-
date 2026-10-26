import { useEffect } from "react";

// Writes scroll progress (--sp), hero scroll depth (--sy) and drives the pinned horizontal-scroll section.
export default function useScrollVars(route) {
  useEffect(() => {
    let queued = 0;

    const update = () => {
      queued = 0;
      const root = document.documentElement.style;
      const h = innerHeight;
      const y = scrollY;
      root.setProperty("--sy", Math.min(y / h, 1.2).toFixed(3));
      root.setProperty("--sp", (y / Math.max(1, document.body.scrollHeight - h)).toFixed(4));

      const hs = document.querySelector(".hs");
      if (hs) {
        const rc = hs.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, -rc.top / (rc.height - h)));
        const track = hs.querySelector(".hs-track");
        track.style.transform = `translateX(${-p * Math.max(0, track.scrollWidth - innerWidth)}px)`;
        hs.style.setProperty("--hp", p.toFixed(3));
      }
    };

    const onScroll = () => {
      if (!queued) queued = requestAnimationFrame(update);
    };

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    update();
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [route]);
}
