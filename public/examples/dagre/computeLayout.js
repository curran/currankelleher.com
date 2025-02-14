import * as dagre from "dagre";

console.log(dagre);

export const computeLayout = ({ data, width, height }) => {
  // Create a new directed graph
  const g = new dagre.graphlib.Graph();

  // Set default edge direction and spacing
  g.setGraph({
    rankdir: "LR",
    nodesep: 70,
    ranksep: 100,
    marginx: 20,
    marginy: 20,
  });

  // Default to assigning a new object as a label for each edge
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph
  data.nodes.forEach((node) => {
    g.setNode(node.id, {
      label: node.label,
      width: 100,
      height: 40,
    });
  });

  // Add edges to the graph
  data.edges.forEach(({ source, target }) => {
    g.setEdge(source, target);
  });

  // Compute the layout
  dagre.layout(g);

  // Extract positions from the layout
  const nodes = data.nodes.map((node) => {
    const { x, y, width, height } = g.node(node.id);
    return { ...node, x, y, width, height };
  });

  const edges = data.edges.map((edge) => {
    const points = g.edge(edge.source, edge.target).points;
    return { ...edge, points };
  });

  return { nodes, edges };
};