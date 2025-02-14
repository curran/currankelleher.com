import { csv } from "d3";

export const loadDataNotQuiteRight = ({ csvURL, state, setState }) => {
  if (!state.data) {
    csv(csvURL).then((data) => {
      setState((state) => ({ ...state, data }));
    });
  }
  return state.data;
};