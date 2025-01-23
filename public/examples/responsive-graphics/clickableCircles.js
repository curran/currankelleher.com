import { renderCircles } from "./renderCircles.js";
export const clickableCircles = (circles, { data, state, setState }) => {
  circles
    .attr("cursor", "pointer")
    .on("click", (event, selectedDatum) => {
      setState((state) => ({ ...state, selectedDatum }));
    })
    .attr("stroke", "none")
    .filter((d) => d === state.selectedDatum)
    .attr("stroke", "black")
    .attr("stroke-width", 5)
    .raise();
};