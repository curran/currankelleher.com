import { data } from "./data.js";
import { renderSVG } from "./renderSVG.js";
import { clickableCircles } from "./clickableCircles.js";

export const main = (container, { state, setState }) => {
  const svg = renderSVG(container);
  clickableCircles(svg, { data, state, setState });
};