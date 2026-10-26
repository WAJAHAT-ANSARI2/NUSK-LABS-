const LINKS = [["#/", "Home", "home"], ["#/blog", "Blog", "blog"], ["#/contact", "Contact", "contact"]];

export default function Header({ page }) {
  // Clicking the link of the page you're already on scrolls back to the top.
  const toTop = (hash) => () => {
    if ((location.hash || "#/") === hash) scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header>
      <a className="logo" href="#/" onClick={toTop("#/")}>NUSK<b>.</b>LABS</a>
      <nav>
        {LINKS.map(([hash, label, key]) => (
          <a key={key} href={hash} className={page === key ? "on" : ""} onClick={toTop(hash)}>{label}</a>
        ))}
      </nav>
    </header>
  );
}
