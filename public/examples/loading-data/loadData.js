import { csv } from "d3";

export const loadData = ({ csvURL, state, setState }) => {
  if (!state.data && !state.dataIsLoading) {
    setState((state) => ({ ...state, dataIsLoading: true }));
    csv(csvURL).then((data) => {
      setState((state) => ({ ...state, data, dataIsLoading: false }));
    });
  }
  return state.data;
};