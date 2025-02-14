import { computeLayout } from "./computeLayout.js";

export const renderGraph = (svg, { data, width, height }) => {
  const layout = computeLayout({ data, width, height });

  // Create groups for nodes and edges
  const nodesGroup = svg
    .selectAll(".nodes")
    .data([null])
    .join("g")
    .attr("class", "nodes");

  const edgesGroup = svg
    .selectAll(".edges")
    .data([null])
    .join("g")
    .attr("class", "edges");

  // Render edges with arrow markers
  svg
    .selectAll("defs")
    .data([null])
    .join("defs")
    .selectAll("marker")
    .data([null])
    .join("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .selectAll("path")
    .data([null])
    .join("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#999");

  // Render edges
  edgesGroup
    .selectAll("path")
    .data(layout.edges)
    .join("path")
    .attr("d", (d) => {
      const points = d.points;
      return (
        `M${points[0].x},${points[0].y}` +
        points
          .slice(1)
          .map((p) => `L${p.x},${p.y}`)
          .join("")
      );
    })
    .attr("stroke", "#999")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("marker-end", "url(#arrow)");

  // Render nodes
  const nodes = nodesGroup
    .selectAll("g")
    .data(layout.nodes)
    .join("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  nodes
    .selectAll("rect")
    .data((d) => [d])
    .join("rect")
    .attr("x", (d) => -d.width / 2)
    .attr("y", (d) => -d.height / 2)
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height)
    .attr("rx", 5)
    .attr("fill", "#fff")
    .attr("stroke", "#333");

  nodes
    .selectAll("text")
    .data((d) => [d])
    .join("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .text((d) => d.label);

  return { nodes, edges: edgesGroup.selectAll("path") };
};