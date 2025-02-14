---
layout: ../../layouts/BlogPost.astro
title: "Deep Linking"
date: "2025-02-15"
description: "Use URL parameters for sharing dataviz state in D3.js"
tags:
  ["d3.js", "javascript", "visualization", "state management", "deep linking"]
---

The concept of "Deep Linking" refers to the practice of linking to a specific state of an application, rather than just the application itself. This is particularly useful for interactive visualizations, where users may want to share a specific view or state of the visualization with others. By using URL parameters to encode the state of the application, users can easily bookmark or share links that preserve the state of the visualization. This enables users to collaborate more effectively, as they can share specific insights or findings with others.

In this article, we'll explore how to manage state in D3.js visualizations using URL parameters for sharing. We'll implement a simple example of clickable circles that change color when clicked, and show how to use unidirectional data flow to manage the state of the application. We'll also demonstrate how to synchronize the application state with the URL, enabling users to share specific states of the visualization.

**[open full screen and click](/examples/deep-linking/index.html) to try it out!**

- Notice that when you click a circle, the URL changes to reflect the selected circle.
- You can share the URL with others to show them the same selected circle.
- Try copying the URL and opening it in a new tab to see the selected circle restored!

<iframe src="/examples/deep-linking/index.html" width="100%" height="400px" style="border: none; border-radius: 4px;"></iframe>

[source code](https://github.com/curran/currankelleher.com/tree/main/public/examples/deep-linking)

Builds on the [previous post: clickable circles](../clickable-circles).

**getSelectedDatumFromURL.js**

```javascript
export const getSelectedDatumFromURL = (data) => {
  const params = new URLSearchParams(window.location.search);
  const index = params.get("selected");
  return index !== null ? data[parseInt(index)] : null;
};
```

This function `getSelectedDatumFromURL` reads the `selected` parameter from the URL and returns the corresponding datum from the data array. If the parameter is not present or invalid, it returns `null`. This function is used to initialize the selection state when the visualization loads, ensuring that the selected circle is correctly highlighted based on the URL.

**updateURL.js**

```javascript
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
```

This `updateURL` function updates the URL with the selected circle. It first finds the index of the selected datum in the data array. If the index is valid, it sets the `selected` parameter in the URL to the index. If the index is not found (e.g., if the selected datum is `null`), it removes the `selected` parameter from the URL. The function uses `window.history.replaceState` to update the URL without adding a new entry to the browser's history stack, ensuring that the URL changes are silent and do not affect the user's browsing history.

**clickableCircles.js**

```javascript
import { getSelectedDatumFromURL } from "./getSelectedDatumFromURL.js";
import { updateURL } from "./updateURL.js";
import { renderCircles } from "./renderCircles.js";

export const clickableCircles = (svg, { data, state, setState }) => {
  const urlSelection = getSelectedDatumFromURL(data);

  // Update state to match URL selection
  if (urlSelection && urlSelection !== state.selectedDatum) {
    setState((state) => ({ ...state, selectedDatum: urlSelection }));
    return;
  }

  renderCircles(svg, { data })
    .attr("cursor", "pointer")
    .on("click", (event, selectedDatum) => {
      setState((state) => {
        updateURL(data, selectedDatum);
        return { ...state, selectedDatum };
      });
    })
    .attr("stroke", "none")
    .filter((d) => d === state.selectedDatum)
    .attr("stroke", "black")
    .attr("stroke-width", 5)
    .raise();
};
```

The `clickableCircles` function includes URL parameter handling to enable deep linking. When the component mounts, it checks for a `selected` parameter in the URL (e.g., `?selected=2`) and uses this to initialize the selection state. This allows users to share links that preserve the selected state of the visualization.

The function first calls `getSelectedDatumFromURL` to check if there's an initial selection in the URL. If there is, and it differs from the current state, it updates the state accordingly. This ensures that when someone opens a shared link, they see the same selection as the person who shared it.

When rendering, we use the previously defined `renderCircles` function and chain additional D3 operations onto it. We set `.attr("cursor", "pointer")` to indicate that the circles are clickable - an important interaction affordance that helps users understand they can interact with the circles.

The click event handler now does two things: it updates the state with the selected circle (using the functional update pattern with `setState`), and it updates the URL using `updateURL`. The URL update uses `window.history.replaceState` to modify the URL without adding a new entry to the browser's history stack. This means the URL updates silently as users click different circles.

The visual feedback for selection remains the same - selected circles get a black stroke and are raised to the top of the SVG. The selection state is now preserved in both the application state and the URL, making it easy to share specific states of the visualization.

## Conclusion

In this article, we covered "Deep Linking" in D3.js visualizations, focusing on managing state with URL parameters for sharing. We implemented a simple example of clickable circles that change color when clicked, and demonstrated how to use URL parameters to encode the state of the application. By synchronizing the application state with the URL, users can easily share specific states of the visualization with others.

<details>
<summary>Full code listing</summary>

**index.js**

```javascript
import { data } from "./data.js";
import { renderSVG } from "./renderSVG.js";
import { clickableCircles } from "./clickableCircles.js";

export const main = (container, { state, setState }) => {
  const svg = renderSVG(container);
  clickableCircles(svg, { data, state, setState });
};
```

**renderCircles.js**

```javascript
export const renderCircles = (svg, { data }) =>
  svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", (d) => d.fill)
    .attr("opacity", 700 / 1000);
```

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clickable Circles</title>
    <link rel="stylesheet" href="styles.css" />
    <script type="importmap">
      { "imports": { "d3": "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm" } }
    </script>
  </head>
  <body>
    <div id="viz-container"></div>
    <script type="module" src="./setup.js"></script>
  </body>
</html>
```

**setup.js**

```javascript
import { main } from "./index.js";
const container = document.getElementById("viz-container");

let state = {};

const setState = (next) => {
  state = next(state);
  render();
};

const render = () => {
  main(container, { state, setState });
};

render();
```

**styles.css**

```css
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#viz-container {
  width: 100%;
  height: 100%;
}
```

**renderSVG.js**

```javascript
import { select } from "d3";

export const renderSVG = (container) =>
  select(container)
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("width", container.clientWidth)
    .attr("height", container.clientHeight)
    .style("background", "#F0FFF4");
```

**data.js**

```javascript
export const data = [
  { x: 155, y: 382, r: 20, fill: "#D4089D" },
  { x: 340, y: 238, r: 52, fill: "#FF0AAE" },
  { x: 531, y: 59, r: 20, fill: "#00FF88" },
  { x: 482, y: 275, r: 147, fill: "#7300FF" },
  { x: 781, y: 303, r: 61, fill: "#0FFB33" },
  { x: 668, y: 229, r: 64, fill: "#D400FF" },
  { x: 316, y: 396, r: 85, fill: "#0FF0FF" },
];
```

</details>
