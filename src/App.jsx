import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MatrixRain from "./components/MatrixRain";
import CursorGlow from "./components/CursorGlow";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import Contact from "./pages/Contact";
import useHashRoute from "./hooks/useHashRoute";
import usePointerEffects from "./hooks/usePointerEffects";
import useScramble from "./hooks/useScramble";
import useScrollVars from "./hooks/useScrollVars";

export default function App() {
  const [route, wipe] = useHashRoute();
  const [toast, setToast] = useState("");

  usePointerEffects();
  useScramble();
  useScrollVars(route);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const parts = route.replace("#/", "").split("/");
  const page = parts[0] || "home";

  let view;
  if (page === "blog") view = parts[1] ? <Post id={parts[1]} /> : <Blog />;
  else if (page === "contact") view = <Contact notify={notify} />;
  else view = <Home />;

  return (
    <>
      <MatrixRain />
      <div className="bar" />
      <CursorGlow />
      <Header page={page} />
      <main>{view}</main>
      <Footer />
      {toast && <div className="toast" role="status">{toast}</div>}
      {wipe > 0 && <div className="wipe" key={wipe}><b>NUSK<i>.</i>LABS</b></div>}
    </>
  );
}
