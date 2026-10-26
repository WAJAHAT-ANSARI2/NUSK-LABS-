import Globe from "../components/Globe";
import Terminal from "../components/Terminal";
import Reveal from "../components/Reveal";
import HuntSection from "../components/HuntSection";
import PostCard from "../components/PostCard";
import { POSTS } from "../data/posts";
import { PANELS, VULNS } from "../data/content";

export default function Home() {
  return (
    <div>
      <div className="hero">
        <Globe />
        <div className="in">
          <h1>We hunt bugs<br />while you <span className="glitch" data-t="sleep.">sleep.</span></h1>
          <p className="lead">Nusk Labs is a cybersecurity lab. We research vulnerabilities, play bug bounty, and write about everything we learn.</p>
          <a className="btn" href="#/blog">Read the blog</a>
          <a className="btn ghost" href="#/contact">Contact us</a>
          <Terminal />
        </div>
        <div className="sc">scroll</div>
      </div>

      <div className="marq">
        <div className="track">
          {[...VULNS, ...VULNS].map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      <div className="stats">
        <div><b>Web</b>application security</div>
        <div><b>Bug Bounty</b>recon and reports</div>
        <div><b>Open</b>learn and share</div>
      </div>

      <section className="blk">
        <Reveal>
          <h2>What we do</h2>
          <p className="sub">We are starting with the basics. More will be added over time.</p>
        </Reveal>
        <div className="grid">
          <div className="panels">
            {PANELS.map(([icon, title, text]) => (
              <div className="pn" key={title} data-n={icon}>
                <span className="v">{title}</span>
                <div className="pc">
                  <div className="ico">{icon}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HuntSection />

      <section className="blk" style={{ paddingTop: 0 }}>
        <Reveal>
          <h2>Latest blogs</h2>
          <p className="sub">Our newest posts.</p>
        </Reveal>
        <div className="grid">
          {POSTS.slice(0, 3).map((p) => <PostCard post={p} key={p.id} />)}
        </div>
      </section>
    </div>
  );
}
