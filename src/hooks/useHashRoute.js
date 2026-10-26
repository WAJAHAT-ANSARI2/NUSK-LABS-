import { useEffect, useState } from "react";

// Tiny hash router. `wipe` increments on every navigation to replay the page-transition overlay.
export default function useHashRoute() {
  const [route, setRoute] = useState(location.hash || "#/");
  const [wipe, setWipe] = useState(0);

  useEffect(() => {
    let id;
    const onChange = () => {
      setWipe((k) => k + 1);
      id = setTimeout(() => {
        setRoute(location.hash || "#/");
        scrollTo(0, 0);
      }, 320);
    };
    addEventListener("hashchange", onChange);
    return () => {
      removeEventListener("hashchange", onChange);
      clearTimeout(id);
    };
  }, []);

  return [route, wipe];
}
