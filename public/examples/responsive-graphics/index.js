import { data } from "./data.js";
import { observeDimensions } from "./observeDimensions.js";
import { renderSVG } from "./renderSVG.js";
import { renderCircles } from "./renderCircles.js";
import { clickableCircles } from "./clickableCircles.js";

export const main = (container, { state, setState }) => {
  const dimensions = observeDimensions(container, { state, setState });
  if (!dimensions) return;
  const { width, height } = dimensions;
  const svg = renderSVG(container, { width, height });
  const circles = renderCircles(svg, { data, width, height });
  clickableCircles(circles, { data, state, setState, dimensions });
};