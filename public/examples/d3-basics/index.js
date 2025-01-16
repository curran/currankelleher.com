import { data } from "./data.js";
import { renderSVG } from "./renderSVG.js";
import { renderCircles } from "./renderCircles.js";

export const main = (container) => {
  const svg = renderSVG(container);
  renderCircles(svg, { data });
};
