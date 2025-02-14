export const observeDimensions = (container, { state, setState }) => {
  if (!state.dimensions) {
    new ResizeObserver(() => {
      const dimensions = {
        width: container.clientWidth,
        height: container.clientHeight,
      };
      setState((state) => ({ ...state, dimensions }));
    }).observe(container);
    return null;
  }
  return state.dimensions;
};