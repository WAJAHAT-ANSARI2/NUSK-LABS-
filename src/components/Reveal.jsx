import { useEffect, useRef, useState } from "react";

// Fades/slides children in once when scrolled into view, and "decrypts" the first <h2> inside.
export default function Reveal({ children }) {
  const ref = useRef();
  const [on, setOn] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setOn(true);
      io.disconnect();
      const h2 = ref.current.querySelector("h2");
      if (h2) setTimeout(() => h2.dispatchEvent(new PointerEvent("pointerover", { bubbles: true })), 250);
    }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={"rv" + (on ? " on" : "")}>{children}</div>;
}
