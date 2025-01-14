---
layout: ../../layouts/BlogPost.astro
title: "Getting Started with D3.js"
date: "2024-03-27"
description: "A beginner's guide to creating your first visualization with D3.js"
---

D3.js is the Swiss Army knife of data visualization. Let's explore how to create your first visualization.

## Setting Up

First, include D3.js in your project:

```html
<script src="https://d3js.org/d3.v7.min.js"></script>
```

## Your First Visualization

Let's create a simple bar chart:

```js
const data = [4, 8, 15, 16, 23, 42];

const svg = d3.select('body')
  .append('svg')
  .attr('width', 400)
  .attr('height', 200);

svg.selectAll('rect')
  .data(data)
  .join('rect')
  .attr('x', (d, i) => i * 70)
  .attr('y', d => 200 - d * 4)
  .attr('width', 65)
  .attr('height', d => d * 4)
  .attr('fill', 'steelblue');
```

This code creates a basic bar chart that visualizes our data array. Each number becomes a rectangle with a height proportional to its value.

## Key Concepts

1. **Selection**: `d3.select()` and `selectAll()`
2. **Data Binding**: `.data()` and `.join()`
3. **Attributes**: `.attr()`
4. **Scales**: Converting data to visual properties

In future posts, we'll explore more advanced concepts and create more complex visualizations!