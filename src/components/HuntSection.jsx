import { STEPS } from "../data/content";

// Tall section with a pinned stage; useScrollVars slides .hs-track sideways as you scroll through it.
export default function HuntSection() {
  return (
    <section className="hs">
      <div className="hs-pin">
        <h2 className="hs-t">How a bug gets hunted</h2>
        <div className="hs-track">
          {STEPS.map(([title, text], i) => (
            <div className="st" key={title}>
              <span className="sn">{"0" + (i + 1)}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="hs-bar"><i /></div>
      </div>
    </section>
  );
}
