import { useEffect } from "react";

const CHARS = "!<>-_[]{}=+*^?#01";
const SELECTOR = "nav a,.btn,h2,h3,.hs-t,.big,.tag";

// Hovering (or revealing) a text element scrambles its letters in a monospace font, then restores them.
// Only touches elements whose content is plain text.
export default function useScramble() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    const run = (e) => {
      const el = e.target.closest?.(SELECTOR);
      if (!el || el.dataset.sc || el.children.length) return;
      const original = el.textContent;
      el.dataset.sc = 1;
      el.classList.add("scr");
      let i = 0;
      const id = setInterval(() => {
        el.textContent = original
          .split("")
          .map((ch, k) => (k < i || ch === " " ? ch : CHARS[(Math.random() * CHARS.length) | 0]))
          .join("");
        if (i++ >= original.length) {
          clearInterval(id);
          el.textContent = original;
          delete el.dataset.sc;
          el.classList.remove("scr");
        }
      }, 35);
    };

    addEventListener("pointerover", run);
    return () => removeEventListener("pointerover", run);
  }, []);
}
