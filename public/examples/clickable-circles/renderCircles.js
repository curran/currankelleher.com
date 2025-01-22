export const renderCircles = (svg, { data, state, setState }) =>
  svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", (d) => d.fill)
    .attr("opacity", 700 / 1000);