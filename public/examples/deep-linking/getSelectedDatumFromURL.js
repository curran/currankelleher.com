export const getSelectedDatumFromURL = (data) => {
  const params = new URLSearchParams(window.location.search);
  const index = params.get("selected");
  return index !== null ? data[parseInt(index)] : null;
};