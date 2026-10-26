import { LAND } from "../data/land";

export const TW = 720;
export const TH = 360;

// lat/lon (degrees) -> unit vector. y is up, z points at the viewer when lon = 0.
export const ll = (la, lo) => {
  la *= Math.PI / 180;
  lo *= Math.PI / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

// Direction of the sun in world space, from the current UTC time and date.
export const sunVec = () => {
  const d = new Date();
  const h = d.getUTCHours() + d.getUTCMinutes() / 60;
  const doy = (d - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5;
  const dec = 23.44 * Math.sin((2 * Math.PI * (doy - 81)) / 365);
  return ll(dec, -(h - 12) * 15);
};

// Rasterizes the LAND polygons once into a land/ocean lookup table.
export const mkTex = () => {
  const c = document.createElement("canvas");
  c.width = TW;
  c.height = TH;
  const x = c.getContext("2d");
  x.fillStyle = "#fff";
  LAND.forEach((s) => {
    const a = s.split(",").map(Number);
    x.beginPath();
    for (let i = 0; i < a.length; i += 2) {
      const X = (a[i] + 180) * 2;
      const Y = (90 - a[i + 1]) * 2;
      i ? x.lineTo(X, Y) : x.moveTo(X, Y);
    }
    x.closePath();
    x.fill();
  });
  const d = x.getImageData(0, 0, TW, TH).data;
  const m = new Uint8Array(TW * TH);
  for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3];
  return m;
};
