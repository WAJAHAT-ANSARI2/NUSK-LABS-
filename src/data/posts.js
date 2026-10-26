// ADD YOUR BLOGS HERE. Copy one object, change the fields, done.
// cover: image shown on the card and at the top of the post (put files in public/blog/).
// body items:
//   "text"                                  paragraph
//   { h: "text" }                           small heading
//   { img: "/blog/pic.png", alt, caption }  picture inside the post
//   { code: "payload here" }                code / payload block
export const POSTS = [
  {
    id: "xss-basics",
    title: "What is XSS and how to find it",
    date: "2026-10-10",
    tag: "Web",
    cover: "/blog/xss-basics.svg",
    intro: "The basics of cross-site scripting and a simple way to hunt for it in bug bounty programs.",
    body: [
      "XSS happens when a website shows user input on a page without checking it. An attacker can then run their own JavaScript there.",
      { h: "Where to look" },
      "Search boxes, comments, URL parameters and profile fields. Anywhere input comes back to the screen.",
      { code: "<script>alert(document.domain)</script>" },
      { img: "/blog/xss-basics.svg", alt: "XSS example", caption: "Example picture inside a post." },
      { h: "What to put in the report" },
      "The exact URL, the payload, steps to reproduce and the impact. A clear report gets rewarded faster.",
    ],
  },
  {
    id: "recon-101",
    title: "Recon 101: the first step to understanding a target",
    date: "2026-10-05",
    tag: "Recon",
    cover: "/blog/recon-101.svg",
    intro: "Before hunting bugs, map the target's subdomains, technologies and endpoints.",
    body: [
      "Good recon is half the battle. The more attack surface you know, the more bugs you can find.",
      { h: "Basic steps" },
      "Subdomain enumeration, technology fingerprinting, archived URLs and JavaScript file analysis.",
    ],
  },
  {
    id: "safe-reporting",
    title: "Responsible disclosure: how to report a bug safely",
    date: "2026-09-28",
    tag: "Guide",
    cover: "/blog/safe-reporting.svg",
    intro: "You found a bug. Now learn how to report it the right way.",
    body: [
      "Always read the program's scope and rules first. Never test outside the scope.",
      { h: "Golden rules" },
      "Do not touch real user data, do not take services down, and do not go public until the bug is fixed.",
    ],
  },
];
