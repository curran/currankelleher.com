import { arc, scaleLinear, scaleOrdinal } from "d3";

const colors = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#9400D3", // Violet
];

const arcGenerator = arc();

const xScale = scaleLinear().domain([0, 960]);
const yScale = scaleLinear().domain([0, 500]);
const colorScale = scaleOrdinal(colors).domain(colors.map((_, i) => i));

export const renderArcs = (svg, { width, height }) => {
  xScale.range([0, width]);
  yScale.range([0, height]);

  const outerRadius = Math.min(width, height) / 2;
  const minInnerRadius = outerRadius * 0.6; // Introducing inner space
  const innerRadiusStep = (outerRadius - minInnerRadius) / colors.length;

  const data = colors.map((color, i) => ({
    innerRadius: outerRadius - (i + 1) * innerRadiusStep,
    outerRadius: outerRadius - i * innerRadiusStep,
    startAngle: 0,
    endAngle: Math.PI,
    fill: color,
  }));

  return svg
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("d", (d) =>
      arcGenerator({
        innerRadius: d.innerRadius,
        outerRadius: d.outerRadius,
        startAngle: d.startAngle,
        endAngle: d.endAngle,
      })
    )
    .attr("fill", (d) => d.fill)
    .attr("transform", `translate(${width / 2}, ${height / 2}) rotate(-90)`);
};