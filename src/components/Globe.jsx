import { useEffect, useRef, useState } from "react";
import { createGlobe } from "./globe/engine";

export default function Globe() {
  const canvas = useRef();
  const count = useRef();
  const label = useRef();
  const autoRef = useRef(true);
  const [spinning, setSpinning] = useState(true);

  useEffect(
    () =>
      createGlobe(canvas.current, {
        autoRef,
        onUserStop: () => setSpinning(false),
        onCount: (n) => count.current && (count.current.textContent = n),
        onLabel: (s) => label.current && (label.current.textContent = s),
      }),
    []
  );

  const toggle = () => {
    autoRef.current = !autoRef.current;
    setSpinning(autoRef.current);
  };

  return (
    <div className="globe-wrap">
      <canvas ref={canvas} className="orb3" aria-label="Live threat globe" />
      <div className="hud">
        <b ref={count}>0</b>attacks blocked
        <div className="loc"><span ref={label}>Facing: ...</span></div>
        <button className="gb" onClick={toggle}>{spinning ? "⏸ Pause" : "▶ Spin"}</button>
        <br />
        <small>Drag the globe, then let go. Where it is day the whole site turns to day, where it is night it turns to night.</small>
      </div>
    </div>
  );
}
