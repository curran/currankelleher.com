---
layout: ../../layouts/BlogPost.astro
title: "Rainbow Face"
date: "2025-02-16"
description: "AI Coding Experiment making a Rainbow Face"
---

<iframe src="/examples/rainbow-face/index.html" width="100%" height="400px" style="border: none; border-radius: 4px;"></iframe>

[source code](https://github.com/curran/currankelleher.com/tree/main/public/examples/rainbow-face)

This is the result from a coding session with my daughter where we used ChatGPT to write this code. Here's the video!

<iframe width="560" height="315" src="https://www.youtube.com/embed/yrDLek8yUbs?si=dq4MVla89CWs3LUE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

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
    .style("background", "linear-gradient(to bottom, #87CEFA, #FFFFFF)");
```

**index.js**

```javascript
import { observeDimensions } from "./observeDimensions.js";
import { renderSVG } from "./renderSVG.js";
import { renderArcs } from "./renderArcs.js";
import { renderEyes } from "./renderEyes.js";
import { renderMouth } from "./renderMouth.js";
import { renderRain } from "./renderRain.js";

export const main = (container, { state, setState }) => {
  const dimensions = observeDimensions(container, { state, setState });
  if (!dimensions) return;
  const { width, height } = dimensions;
  const svg = renderSVG(container, { width, height });
  renderArcs(svg, { width, height });
  renderEyes(svg, { width, height });
  renderMouth(svg, { width, height });
  renderRain(svg, { width, height });
};
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

**data.js**

```javascript
export const data = [
  { x: 155, y: 382, r: 60, fill: "#FF0000" }, // Red
  { x: 280, y: 340, r: 60, fill: "#FF7F00" }, // Orange
  { x: 405, y: 298, r: 60, fill: "#FFFF00" }, // Yellow
  { x: 530, y: 256, r: 60, fill: "#00FF00" }, // Green
  { x: 655, y: 214, r: 60, fill: "#0000FF" }, // Blue
  { x: 780, y: 172, r: 60, fill: "#4B0082" }, // Indigo
  { x: 905, y: 130, r: 60, fill: "#9400D3" }, // Violet
];
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

**renderArcs.js**

```javascript
import { arc, scaleLinear, scaleOrdinal } from "d3";

const colors = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#9400D3", // Violet
];

const arcGenerator = arc();

const xScale = scaleLinear().domain([0, 960]);
const yScale = scaleLinear().domain([0, 500]);
const colorScale = scaleOrdinal(colors).domain(colors.map((_, i) => i));

export const renderArcs = (svg, { width, height }) => {
  xScale.range([0, width]);
  yScale.range([0, height]);

  const outerRadius = Math.min(width, height) / 2;
  const minInnerRadius = outerRadius * 0.6; // Introducing inner space
  const innerRadiusStep = (outerRadius - minInnerRadius) / colors.length;

  const data = colors.map((color, i) => ({
    innerRadius: outerRadius - (i + 1) * innerRadiusStep,
    outerRadius: outerRadius - i * innerRadiusStep,
    startAngle: 0,
    endAngle: Math.PI,
    fill: color,
  }));

  return svg
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("d", (d) =>
      arcGenerator({
        innerRadius: d.innerRadius,
        outerRadius: d.outerRadius,
        startAngle: d.startAngle,
        endAngle: d.endAngle,
      })
    )
    .attr("fill", (d) => d.fill)
    .attr("transform", `translate(${width / 2}, ${height / 2}) rotate(-90)`);
};
```

**renderEyes.js**

```javascript
export const renderEyes = (svg, { width, height }) => {
  const eyeYPosition = height * 0.2;
  const eyeData = [
    { x: width * 0.35, y: eyeYPosition, r: 20 },
    { x: width * 0.65, y: eyeYPosition, r: 20 },
  ];

  const pupilData = eyeData.map((eye) => ({
    x: eye.x,
    y: eye.y,
    r: eye.r * 0.4,
  }));

  svg
    .selectAll(".eye")
    .data(eyeData)
    .join("circle")
    .attr("class", "eye")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  svg
    .selectAll(".pupil")
    .data(pupilData)
    .join("circle")
    .attr("class", "pupil")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", "black");
};
```

**renderMouth.js**

```javascript
import { arc } from "d3";

export const renderMouth = (svg, { width, height }) => {
  const mouthData = {
    innerRadius: 35,
    outerRadius: 45,
    startAngle: Math.PI * 0.2,
    endAngle: Math.PI * 0.8,
    x: width / 2,
    y: height * 0.24,
  };

  const arcGenerator = arc();

  svg
    .selectAll(".mouth")
    .data([mouthData])
    .join("path")
    .attr("class", "mouth")
    .attr("d", (d) =>
      arcGenerator({
        innerRadius: d.innerRadius,
        outerRadius: d.outerRadius,
        startAngle: d.startAngle,
        endAngle: d.endAngle,
      })
    )
    .attr("fill", "black")
    .attr("stroke", "white")
    .attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(90)`);
};
```

**renderRain.js**

```javascript
import { easeLinear, select } from "d3";

export const renderRain = (svg, { width, height }) => {
  const numDrops = 50;
  const rainData = Array.from({ length: numDrops }, () => ({
    x: Math.random() * width,
    // Start slightly above the top of the SVG so that drops "come in" from the sky
    y: -Math.random() * 100,
    length: Math.random() * 20 + 10,
    // Give each raindrop its own random speed (duration in ms)
    speed: 2000 + Math.random() * 3000,
  }));

  const raindrops = svg
    .selectAll(".raindrop")
    .data(rainData)
    .join("line")
    .attr("class", "raindrop")
    .attr("x1", (d) => d.x)
    .attr("x2", (d) => d.x)
    .attr("y1", (d) => d.y)
    .attr("y2", (d) => d.y + d.length)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("opacity", 0.7);

  // A recursive function that handles the "fall" animation
  function animateRain(raindrop, dropData) {
    // Reset raindrop to "top" position before transition (so it loops)
    raindrop
      .attr("y1", -dropData.length)
      .attr("y2", 0)
      .transition()
      .duration(dropData.speed)
      .ease(easeLinear)
      // Move to the bottom of the SVG
      .attr("y1", height)
      .attr("y2", height + dropData.length)
      // When transition ends, call animateRain again
      .on("end", () => animateRain(raindrop, dropData));
  }

  // Kick off the rain animation for each raindrop
  raindrops.each(function (d) {
    // 'this' is the DOM element for the current raindrop
    const raindrop = select(this);
    animateRain(raindrop, d);
  });
};
```
