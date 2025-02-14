import { loadData } from "./loadData.js";
import { observeDimensions } from "./observeDimensions.js";
import { renderSVG } from "./renderSVG.js";
import { renderCircles } from "./renderCircles.js";
import { clickableCircles } from "./clickableCircles.js";

export const main = (container, { state, setState }) => {
  const data = loadData({ csvURL: "data.csv", state, setState });
  if (!data) return;

  const dimensions = observeDimensions(container, { state, setState });
  if (!dimensions) return;
  const { width, height } = dimensions;

  const svg = renderSVG(container, { width, height });
  const circles = renderCircles(svg, { data, width, height });
  clickableCircles(circles, { data, state, setState, dimensions });
};