export const updateURL = (data, selectedDatum) => {
  const index = data.indexOf(selectedDatum);
  const params = new URLSearchParams(window.location.search);

  if (index !== -1) {
    params.set("selected", index);
  } else {
    params.delete("selected");
  }

  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
};