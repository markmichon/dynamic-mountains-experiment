import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

// From (0,80): 10, 72, 16, 64, :To (24,64)
// From (24,64): 32, 64, 24, 72, :To (32,72)

// If Previous Y is > (lower on graph) than current Y,
// Handle A x should be > previous x and Handle A y should be <= previous y
// Handle B x should be < current x and Handle B y should be >= current y

// if Previous Y is < (higher on graph) than current Y,
// Handle A x should be > previous x and Handle A y should be >=  previous y
// Handle B x should be < current x and Handle B y should be <= current y

const createCurve = (currentPoint, prevPoint) => {
  let [cx, cy] = currentPoint;
  let [px, py] = prevPoint;
  let handleA, handleB;
  let h = (cx - px) / 2;

  if (py > cy) {
    // these are the same when Ys are set to equal. Womp womp
    handleA = [px + h, py].join(" ");
    handleB = [cx - h, cy].join(" ");
  } else {
    handleA = [px + h, py].join(" ");
    handleB = [cx - h, cy];
  }
  return `C ${handleA} ${handleB} ${cx} ${cy}`;
};

function createPath(points) {
  const curves = points
    .map((point, idx) => {
      if (idx === 0) {
        return point;
      } else if (idx === points.length) {
        return point;
      } else {
        return createCurve(point, points[idx - 1]);
      }
    })
    .join(" ");
  return `M ${curves}`;
}

function nextV(min, max, prev, variance) {
  let possibleMin = prev - variance > min ? prev - variance : min;
  let possibleMax = prev + variance < max ? prev + variance : max;
  return random(possibleMin, possibleMax);
}

// Width and height of viewbox, total points, variance, and max mountain size
function generateVertices(width, height, count, variance, highestPeak = 0) {
  let increment = width / count;
  let points = [[0, height]];
  let prev = points[0];
  for (let i = 0; i < count - 1; i++) {
    let x = prev[0] + increment;
    let y = nextV(0, height, prev[1], variance);
    if (y < highestPeak) y -= variance;
    prev = [x, y];
    points.push([x, y]);
  }
  points.push([width, height]);
  return points;
}

const vertices = generateVertices(80, 20, 5, 16);

const path1 = createPath(generateVertices(80, 32, 8, 20));
const path2 = createPath(generateVertices(80, 32, 10, 10));
const path3 = createPath(generateVertices(80, 32, 12, 5));
function App() {
  // console.log(createPath([0, 80], [80, 80], vertices));
  console.log(generateVertices(80, 80, 5).length);
  return (
    <div className="App">
      <svg
        viewBox="0 0 80 32"
        style={{
          width: "100%",
          border: "1px solid #333",
          background:
            "repeating-linear-gradient(180deg,#ccc,#ccc 5px,#fff 5px,#fff 1rem)"
        }}
      >
        <path fill="hsla(0,0%,30%,1)" d={path1} />
        <path fill="hsla(0,0%,40%,1)" d={path2} />
        <path fill="hsla(0,0%,50%,1)" d={path3} />
      </svg>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
