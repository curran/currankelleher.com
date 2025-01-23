import { scaleLinear } from "d3";
const xScale = scaleLinear().domain([0, 960]);
const yScale = scaleLinear().domain([0, 500]);
export const renderCircles = (svg, { data, width, height }) => {
  xScale.range([0, width]);
  yScale.range([0, height]);

  return svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", (d) => d.r)
    .attr("fill", (d) => d.fill)
    .attr("opacity", 700 / 1000);
};