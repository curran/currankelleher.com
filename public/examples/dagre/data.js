export const data = {
  nodes: [
    { id: "A", label: "Node A" },
    { id: "B", label: "Node B" },
    { id: "C", label: "Node C" },
    { id: "D", label: "Node D" },
    { id: "E", label: "Node E" },
  ],
  edges: [
    { source: "A", target: "B" },
    { source: "B", target: "C" },
    { source: "C", target: "D" },
    { source: "D", target: "E" },
    { source: "A", target: "E" },
  ],
};