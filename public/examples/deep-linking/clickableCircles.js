import { getSelectedDatumFromURL } from "./getSelectedDatumFromURL.js";
import { updateURL } from "./updateURL.js";
import { renderCircles } from "./renderCircles.js";

export const clickableCircles = (svg, { data, state, setState }) => {
  const urlSelection = getSelectedDatumFromURL(data);

  // Update state to match URL selection
  if (urlSelection && urlSelection !== state.selectedDatum) {
    setState((state) => ({ ...state, selectedDatum: urlSelection }));
    return;
  }

  renderCircles(svg, { data })
    .attr("cursor", "pointer")
    .on("click", (event, selectedDatum) => {
      setState((state) => {
        updateURL(data, selectedDatum);
        return { ...state, selectedDatum };
      });
    })
    .attr("stroke", "none")
    .filter((d) => d === state.selectedDatum)
    .attr("stroke", "black")
    .attr("stroke-width", 5)
    .raise();
};