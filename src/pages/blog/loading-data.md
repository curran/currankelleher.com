---
layout: ../../layouts/BlogPost.astro
title: "Loading Data"
date: "2025-02-14"
description: "How to load CSV data"
---

Data visualization depends on loading data.

Data comes in all shapes and sizes. In the world of D3 data visualizations, the most common forms of data are CSV (Comma Separated Value) and JSON (JavaScript Object Notation). In this article, we'll focus on loading CSV data, which is a common format for tabular data. Even if your data is not a CSV file, chances are it can be exported or transformed into a CSV file.

<iframe src="/examples/loading-data/index.html" width="100%" height="400px" style="border: none; border-radius: 4px;"></iframe>

[source code](https://github.com/curran/currankelleher.com/tree/main/public/examples/loading-data)

## The Problem Statement

I like to phrase problems as user stories like this:

> As a developer of interactive data visualizations, I want to be able to load and use data from a CSV file so that I can create visualizations that are driven by real data.

**data.csv**

```
x,y,r,fill
155,382,20,#D4089D
340,238,52,#FF0AAE
531,59,20,#00FF88
482,275,147,#7300FF
781,303,61,#0FFB33
668,229,64,#D400FF
316,396,85,#0FF0FF
```

Here's our example CSV data. It represents a collection of circles, each with an `x` and `y` position, a radius `r`, and a fill color `fill`. This data could be used to create a scatter plot, where each circle represents a data point.

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

Here's the same data represented as an array of objects in JavaScript, for reference. We won't be using this data directly in our code, but it's useful to have it as a reference to see how CSV data can be represented in JavaScript. The goal is to load the data from the CSV file and use it to create visualizations, instead of importing it from a hardcoded JavaScript file. Note that one difference is that in CSV data, there is no concept of types on the values, so we will need to parse the numbers from the strings.

## The Solution Overview

The solution involves using the `d3.csv` function to load data from a CSV file. This function returns a promise that resolves to the data once it has been loaded. We can then use this data to create visualizations.

**superBasicCSVLoadingSnippet.js**

```javascript
import { csv } from "d3";

csv("data.csv").then((data) => {
  console.log(data);
});
```

This code snippet demonstrates the basic idea of loading data from a CSV file. The `csv` function is imported from the `d3` module, and it is used to load the data from the file `data.csv`. The `then` method is called on the promise returned by `csv`, and it takes a callback function that is called once the data has been loaded. The data is passed to this callback function as an array of objects, and in this case, it is logged to the console.

## The Solution Details

In our case, we are using unidirectional data flow, which means that we'll need to integrate the asynchronous data loading into our existing architecture. We'll need to load the data before rendering the visualization, and then pass the loaded data to the rendering function. We also need to account for the case where the state can change _while_ the data is loading.

**loadData-not-quite-right.js**

```javascript
import { csv } from "d3";

export const loadDataNotQuiteRight = ({ csvURL, state, setState }) => {
  if (!state.data) {
    csv(csvURL).then((data) => {
      setState((state) => ({ ...state, data }));
    });
  }
  return state.data;
};
```

Here's a first attempt at a function to load data. It takes an object with three properties: `csvURL`, `state`, and `setState`. The function checks if the data is not already loaded, and if it is not, it loads the data using the `csv` function. Once the data has been loaded, it updates the state with the loaded data. For convenience, the function returns the loaded data.

The problem with this approach is that it doesn't account for the case where the data is already loading when the function is called. In the unidirectional data flow architecture, the state can change at any time. For example, the resize observer could trigger a re-render while the data is loading. In this case, the function would start loading the data again, even though it is already loading. This could lead to multiple requests for the same data, which is inefficient and could cause problems.

**loadData.js**

```javascript
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
```

To address that issue, we can add a `dataIsLoading` flag to the state to keep track of whether the data is currently loading. We can then check if the data is not already loaded _and_ not already loading before starting to load the data. If the data is not already loading, we set the `dataIsLoading` flag to `true` and start loading the data. Once the data has been loaded, we update the state with the loaded data. This way, if the function is called while the data is already loading, it will not start loading the data again.

**index.js**

```javascript
import { loadData } from "./loadData.js";
import { observeDimensions } from "./observeDimensions.js";
import { renderSVG } from "./renderSVG.js";
import { renderCircles } from "./renderCircles.js";
import { clickableCircles } from "./clickableCircles.js";

export const main = (container, { state, setState }) => {
  const data = loadData({ csvURL: "data.csv", state, setState });
  if (!data) return;

  const dimensions = observeDimensions(container, { state, setState });
  if (!dimensions) return;
  const { width, height } = dimensions;

  const svg = renderSVG(container, { width, height });
  const circles = renderCircles(svg, { data, width, height });
  clickableCircles(circles, { data, state, setState, dimensions });
};
```

Here's our updated `main` function that integrates the data loading function. We call `loadData` with the `csvURL` and the current `state` and `setState` functions. If the data is not loaded, we return early. This guarantees that `data` is defined when we pass it in anywhere, which simplifies the downstream logic. If the data is loaded, we proceed to observe the dimensions of the container, render the SVG element, render the circles, and make the circles clickable!

## Conclusion

Loading data is a fundamental part of creating data visualizations. In this article, we've explored how to load data from a CSV file using the `d3.csv` function. We've also discussed how to integrate data loading into an existing architecture that uses unidirectional data flow. By keeping track of whether the data is currently loading, we can avoid starting multiple requests for the same data. This ensures that the data is loaded efficiently and that the visualization is rendered correctly.

<details>
<summary>Full code listing</summary>

**renderSVG.js**

```javascript
import { select } from "d3";

export const renderSVG = (container, { width, height }) =>
  select(container)
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#F0FFF4");
```

**observeDimensions.js**

```javascript
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
```

**renderCircles.js**

```javascript
import { scaleLinear } from "d3";
const xScale = scaleLinear().domain([0, 960]);
const yScale = scaleLinear().domain([0, 500]);
export const renderCircles = (svg, { data, width, height }) => {
  xScale.range([0, width]);
  yScale.range([0, height]);

  return svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .attr("r", (d) => d.r)
    .attr("fill", (d) => d.fill)
    .attr("opacity", 700 / 1000);
};
```

**clickableCircles.js**

```javascript
import { renderCircles } from "./renderCircles.js";
export const clickableCircles = (circles, { data, state, setState }) => {
  circles
    .attr("cursor", "pointer")
    .on("click", (event, selectedDatum) => {
      setState((state) => ({ ...state, selectedDatum }));
    })
    .attr("stroke", "none")
    .filter((d) => d === state.selectedDatum)
    .attr("stroke", "black")
    .attr("stroke-width", 5)
    .raise();
};
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

</details>
