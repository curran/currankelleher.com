import { csv } from "d3";

csv("data.csv").then((data) => {
  console.log(data);
});