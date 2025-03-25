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