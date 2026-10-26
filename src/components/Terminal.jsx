import { useEffect, useRef, useState } from "react";

const HELP = [
  "help         list commands",
  "whoami       about us",
  "scan <site>  demo scan",
  "blog         open the blog",
  "contact      open contact",
  "clear        clear screen",
];

export default function Terminal() {
  const [lines, setLines] = useState(["Nusk Labs shell v1.0", "Type 'help' and press Enter"]);
  const [value, setValue] = useState("");
  const box = useRef();
  const input = useRef();

  useEffect(() => {
    box.current.scrollTop = box.current.scrollHeight;
  }, [lines]);

  const add = (...a) => setLines((l) => [...l, ...a].slice(-40));
  const go = (hash, msg) => {
    add(msg);
    setTimeout(() => { location.hash = hash; }, 500);
  };

  const run = (raw) => {
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    add("$ " + raw);
    if (cmd === "help") add(...HELP);
    else if (cmd === "whoami") add("Nusk Labs: a cybersecurity research and bug bounty lab.");
    else if (cmd === "blog" || cmd === "blogs") go("#/blog", "opening blog...");
    else if (cmd === "contact") go("#/contact", "opening contact...");
    else if (cmd === "clear") setLines([]);
    else if (cmd === "scan") {
      const target = rest[0] || "example.com";
      [
        "[*] target: " + target,
        "[*] enumerating subdomains...",
        "[+] 12 subdomains found",
        "[*] checking ports...",
        "[+] 443/https open",
        "[!] demo only. Scan authorized targets only.",
      ].forEach((x, i) => setTimeout(() => add(x), i * 450));
    } else if (cmd === "sudo") add("permission denied. Nice try :)");
    else if (cmd) add(`command not found: ${cmd}. Type 'help'.`);
  };

  return (
    <div className="term" onClick={() => input.current.focus()}>
      <div className="dots"><i /><i /><i /></div>
      <pre ref={box}>{lines.join("\n")}</pre>
      <div className="ti">
        <span>$</span>
        <input
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { run(value); setValue(""); }
          }}
          placeholder="type: help"
          aria-label="terminal"
          spellCheck="false"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
