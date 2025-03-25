import { observeDimensions } from "./observeDimensions.js";
import { renderSVG } from "./renderSVG.js";
import { renderArcs } from "./renderArcs.js";
import { renderEyes } from "./renderEyes.js";
import { renderMouth } from "./renderMouth.js";
import { renderRain } from "./renderRain.js";

export const main = (container, { state, setState }) => {
  const dimensions = observeDimensions(container, { state, setState });
  if (!dimensions) return;
  const { width, height } = dimensions;
  const svg = renderSVG(container, { width, height });
  renderArcs(svg, { width, height });
  renderEyes(svg, { width, height });
  renderMouth(svg, { width, height });
  renderRain(svg, { width, height });
};