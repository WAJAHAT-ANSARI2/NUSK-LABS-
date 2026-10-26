import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef();
  useEffect(() => {
    const move = (e) => {
      ref.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);
  return <div className="cur" ref={ref} />;
}
