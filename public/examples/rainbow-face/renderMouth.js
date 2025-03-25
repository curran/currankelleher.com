import { arc } from "d3";

export const renderMouth = (svg, { width, height }) => {
  const mouthData = {
    innerRadius: 35,
    outerRadius: 45,
    startAngle: Math.PI * 0.2,
    endAngle: Math.PI * 0.8,
    x: width / 2,
    y: height * 0.24,
  };

  const arcGenerator = arc();

  svg
    .selectAll(".mouth")
    .data([mouthData])
    .join("path")
    .attr("class", "mouth")
    .attr("d", (d) =>
      arcGenerator({
        innerRadius: d.innerRadius,
        outerRadius: d.outerRadius,
        startAngle: d.startAngle,
        endAngle: d.endAngle,
      })
    )
    .attr("fill", "black")
    .attr("stroke", "white")
    .attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(90)`);
};