export const clickableNodes = (nodes, { state, setState }) => {
  nodes
    .attr("cursor", "pointer")
    .on("click", (event, selectedNode) => {
      setState((state) => ({ ...state, selectedNode }));
    })
    .select("rect")
    .attr("fill", (d) => (d === state.selectedNode ? "#e6e6e6" : "#fff"));
};