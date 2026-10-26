import { useState } from "react";
import { CONTACT_EMAIL, WEB3FORMS_KEY } from "../data/site";

export default function Contact({ notify }) {
  const [f, setF] = useState({ name: "", email: "", type: "General", msg: "", bot: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const send = async (e) => {
    e.preventDefault();
    if (f.bot) return; // hidden spam trap, real people never fill it

    // No key yet: fall back to the visitor's email app.
    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`[${f.type}] ${f.name}`);
      const body = encodeURIComponent(`${f.msg}\n\nFrom: ${f.name} (${f.email})`);
      location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      notify("Opening your email app");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[${f.type}] New message from ${f.name}`,
          from_name: "Nusk Labs website",
          name: f.name,
          email: f.email,
          message: f.msg,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setStatus("sent");
      setF({ name: "", email: "", type: "General", msg: "", bot: "" });
      notify("Message sent. We will reply soon.");
    } catch {
      setStatus("error");
      notify("Could not send. Please try again.");
    }
  };

  return (
    <section className="blk">
      <h2>Contact</h2>
      <p className="sub">Bug report, collaboration or a question? Write to us.</p>
      <form onSubmit={send}>
        <input required placeholder="Name" value={f.name} onChange={set("name")} aria-label="Name" />
        <input required type="email" placeholder="Email" value={f.email} onChange={set("email")} aria-label="Email" />
        <select value={f.type} onChange={set("type")} aria-label="Topic">
          <option>General</option>
          <option>Bug report</option>
          <option>Collaboration</option>
        </select>
        <textarea required rows="6" placeholder="Message" value={f.msg} onChange={set("msg")} aria-label="Message" />
        <input className="hp" tabIndex="-1" autoComplete="off" value={f.bot} onChange={set("bot")} aria-hidden="true" placeholder="Leave empty" />
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : status === "sent" ? "Sent ✓" : "Send message"}
        </button>
      </form>
    </section>
  );
}
