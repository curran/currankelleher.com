import { data } from "./data.js";
import { renderSVG } from "./renderSVG.js";
import { renderGraph } from "./renderGraph.js";
import { observeDimensions } from "./observeDimensions.js";
import { clickableNodes } from "./clickableNodes.js";

export const main = (container, { state, setState }) => {
  const dimensions = observeDimensions(container, { state, setState });
  if (!dimensions) return;
  const { width, height } = dimensions;

  const svg = renderSVG(container, { width, height });
  const { nodes } = renderGraph(svg, { data, width, height });
  clickableNodes(nodes, { state, setState });
};