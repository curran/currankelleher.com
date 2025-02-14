---
layout: ../../layouts/BlogPost.astro
title: "Graph Layout with Dagre"
date: "2025-02-17"
description: "How to create directed graph visualizations using Dagre.js and D3"
---

Disclaimer: This article is mainly AI-generated content. Thanks to Claude!

Directed graphs are a common visualization type for showing relationships between entities, like dependencies between software packages, organizational hierarchies, or process flows. While D3.js provides excellent tools for rendering graphs, it doesn't include built-in layout algorithms for positioning the nodes. This is where [Dagre.js](https://github.com/dagrejs/dagre) comes in - it's a JavaScript library that implements graph layout algorithms specifically designed for directed graphs.

<iframe src="/examples/dagre/index.html" width="100%" height="400px" style="border: none; border-radius: 4px;"></iframe>

[source code](https://github.com/curran/currankelleher.com/tree/main/public/examples/dagre)

## Setting Up Dependencies

For this example, we'll need both D3.js and Dagre.js. We can include them using ES modules:

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dagre Graph Layout</title>
    <script type="importmap">
      {
        "imports": {
          "d3": "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm",
          "dagre": "https://cdn.jsdelivr.net/npm/@dagrejs/dagre@1.1.4/+esm"
        }
      }
    </script>
  </head>
  <body>
    <div id="viz-container"></div>
    <script type="module" src="./setup.js"></script>
  </body>
</html>
```

## Sample Graph Data

Let's define some sample data representing a simple directed graph:

**data.js**

```javascript
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
```

## Computing Layout with Dagre

We'll create a function that uses Dagre to compute the layout positions for our nodes:

**computeLayout.js**

```javascript
import * as dagre from "dagre";

console.log(dagre);

export const computeLayout = ({ data, width, height }) => {
  // Create a new directed graph
  const g = new dagre.graphlib.Graph();

  // Set default edge direction and spacing
  g.setGraph({
    rankdir: "LR",
    nodesep: 70,
    ranksep: 100,
    marginx: 20,
    marginy: 20,
  });

  // Default to assigning a new object as a label for each edge
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph
  data.nodes.forEach((node) => {
    g.setNode(node.id, {
      label: node.label,
      width: 100,
      height: 40,
    });
  });

  // Add edges to the graph
  data.edges.forEach(({ source, target }) => {
    g.setEdge(source, target);
  });

  // Compute the layout
  dagre.layout(g);

  // Extract positions from the layout
  const nodes = data.nodes.map((node) => {
    const { x, y, width, height } = g.node(node.id);
    return { ...node, x, y, width, height };
  });

  const edges = data.edges.map((edge) => {
    const points = g.edge(edge.source, edge.target).points;
    return { ...edge, points };
  });

  return { nodes, edges };
};
```

## Rendering the Graph

Now let's create the rendering logic using D3:

**renderGraph.js**

```javascript
import { computeLayout } from "./computeLayout.js";

export const renderGraph = (svg, { data, width, height }) => {
  const layout = computeLayout({ data, width, height });

  // Create groups for nodes and edges
  const nodesGroup = svg
    .selectAll(".nodes")
    .data([null])
    .join("g")
    .attr("class", "nodes");

  const edgesGroup = svg
    .selectAll(".edges")
    .data([null])
    .join("g")
    .attr("class", "edges");

  // Render edges with arrow markers
  svg
    .selectAll("defs")
    .data([null])
    .join("defs")
    .selectAll("marker")
    .data([null])
    .join("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .selectAll("path")
    .data([null])
    .join("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#999");

  // Render edges
  edgesGroup
    .selectAll("path")
    .data(layout.edges)
    .join("path")
    .attr("d", (d) => {
      const points = d.points;
      return (
        `M${points[0].x},${points[0].y}` +
        points
          .slice(1)
          .map((p) => `L${p.x},${p.y}`)
          .join("")
      );
    })
    .attr("stroke", "#999")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("marker-end", "url(#arrow)");

  // Render nodes
  const nodes = nodesGroup
    .selectAll("g")
    .data(layout.nodes)
    .join("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  nodes
    .selectAll("rect")
    .data((d) => [d])
    .join("rect")
    .attr("x", (d) => -d.width / 2)
    .attr("y", (d) => -d.height / 2)
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height)
    .attr("rx", 5)
    .attr("fill", "#fff")
    .attr("stroke", "#333");

  nodes
    .selectAll("text")
    .data((d) => [d])
    .join("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .text((d) => d.label);

  return { nodes, edges: edgesGroup.selectAll("path") };
};
```

## Putting It All Together

Finally, let's wire everything up using our unidirectional data flow pattern:

**indexPartial.js**

```javascript
import { data } from "./data.js";
import { renderSVG } from "./renderSVG.js";
import { renderGraph } from "./renderGraph.js";
import { observeDimensions } from "./observeDimensions.js";

export const main = (container, { state, setState }) => {
  const dimensions = observeDimensions(container, { state, setState });
  if (!dimensions) return;
  const { width, height } = dimensions;

  const svg = renderSVG(container, { width, height });
  renderGraph(svg, { data, width, height });
};
```

## Making it Interactive

To add interactivity, we can make nodes clickable similar to our previous examples:

**clickableNodes.js**

```javascript
export const clickableNodes = (nodes, { state, setState }) => {
  nodes
    .attr("cursor", "pointer")
    .on("click", (event, selectedNode) => {
      setState((state) => ({ ...state, selectedNode }));
    })
    .select("rect")
    .attr("fill", (d) => (d === state.selectedNode ? "#e6e6e6" : "#fff"));
};
```

Then update our main function to use it:

**index.js**

```javascript
import { data } from "./data.js";
import { renderSVG } from "./renderSVG.js";
import { renderGraph } from "./renderGraph.js";
import { observeDimensions } from "./observeDimensions.js";
import { clickableNodes } from "./clickableNodes.js";

export const main = (container, { state, setState }) => {
  const dimensions = observeDimensions(container, { state, setState });
  if (!dimensions) return;
  const { width, height } = dimensions;

  const svg = renderSVG(container, { width, height });
  const { nodes } = renderGraph(svg, { data, width, height });
  clickableNodes(nodes, { state, setState });
};
```

## Conclusion

This example demonstrates how to create an interactive directed graph visualization using Dagre.js for layout and D3.js for rendering. The unidirectional data flow pattern we've been using works perfectly here, allowing us to manage state for interactions while keeping the code organized and maintainable.

Some potential enhancements you might consider:

- Add zoom and pan behavior
- Implement edge highlighting on node selection
- Add tooltips or labels that show on hover
- Animate transitions when nodes are selected
- Allow dragging nodes to adjust the layout

I hope this helps you get started with directed graph visualizations using Dagre.js and D3!

<details>
<summary>Full code listing</summary>
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

</details>
