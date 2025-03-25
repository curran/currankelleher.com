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