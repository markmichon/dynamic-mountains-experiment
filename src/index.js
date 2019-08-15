import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

function random(min, max) {
  return Math.random() * (max - min) + min
}

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const setFromEvent = e => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', setFromEvent)
    return () => {
      window.removeEventListener('mousemove', setFromEvent)
    }
  }, [])

  return position
}

function App() {
  let [paths, setPaths] = useState([])
  // const position = useMousePosition()
  let [modifiers, setModifiers] = useState({ curve: 4, peak: 2, pathCount: 5 })
  // console.log(position)

  useEffect(() => {
    setPaths(genPaths())
  }, [modifiers])

  const createCurve = (currentPoint, prevPoint) => {
    let [cx, cy] = currentPoint
    let [px, py] = prevPoint
    let handleA, handleB
    let h = (cx - px) / modifiers.curve

    handleA = [px + h, py].join(' ')
    handleB = [cx - h, cy]

    return `C ${handleA} ${handleB} ${cx} ${cy}`
  }

  const createPath = points => {
    const curves = points
      .map((point, idx) => {
        if (idx === 0) {
          return point
        } else if (idx === points.length) {
          return point
        } else {
          return createCurve(point, points[idx - 1])
        }
      })
      .join(' ')
    return `M ${curves}`
  }

  const nextV = (min, max, prev, variance) => {
    let possibleMin = prev - variance > min ? prev - variance : min + variance
    let possibleMax =
      prev + variance < max ? prev + variance : max - variance / 2
    return random(possibleMin, possibleMax)
  }

  // Width and height of viewbox, total points, variance, and max mountain size
  const generateVertices = (
    width,
    height,
    count,
    variance,
    highestPeak = 0
  ) => {
    let increment = width / count
    let points = [[0, height]]
    let prev = points[0]
    for (let i = 0; i < count - 1; i++) {
      let x = prev[0] + increment
      let y = nextV(highestPeak, height, prev[1], variance)
      if (y < highestPeak) y -= variance
      prev = [x, y]
      points.push([x, y])
    }
    points.push([width, height])

    return points
  }

  const genPaths = () => {
    let prevPeak = modifiers.peak
    let paths = []
    for (let i = 0; i < modifiers.pathCount; i++) {
      const newPeak = prevPeak + 4
      prevPeak = newPeak
      paths.push(createPath(generateVertices(80, 32, 15, 4, newPeak)))
    }
    return paths
  }

  // console.log(createPath([0, 80], [80, 80], vertices));

  // let paths = genPaths()

  const handleClick = () => {
    setPaths(genPaths())
  }

  const handleModifier = e => {
    setModifiers({
      ...modifiers,
      [e.target.name]: Number(e.target.value),
    })
  }
  return (
    <div
      className="App"
      style={{ backgroundColor: `hsl(0,0%,10%)`, minHeight: '100vh' }}
      onClick={handleClick}
    >
      <svg
        viewBox="8 0 64 32"
        style={{
          width: '100%',
          margin: 0,
          padding: 0,
          backgroundColor: 'hsl(0,0%,95%)',
          // border: '1px solid #333',
          // background:
          //   'repeating-linear-gradient(180deg,#ccc,#ccc 5px,#fff 5px,#fff 1rem)',
        }}
      >
        {paths.map((path, idx) => (
          <path
            key={idx}
            fill={`hsla(0,0%,${paths.length - idx}0%,1)`}
            d={path}
          />
        ))}
        {/* <path fill="hsla(0,0%,60%,1)" d={paths[0]} />
        <path fill="hsla(0,0%,50%,1)" d={paths[1]} />
        <path fill="hsla(0,0%,40%,1)" d={paths[2]} />
        <path fill="hsla(0,0%,30%,1)" d={paths[3]} />
        <path fill="hsla(0,0%,10%,1)" d={paths[4]} /> */}
      </svg>
      <h1
        style={{
          color: 'hsl(0,0%,85%)',
          fontSize: '3rem',
          textAlign: 'center',
          margin: 0,
          padding: 0,
          lineHeight: 1,
        }}
      >
        Explore
      </h1>
      <input
        type="range"
        min="1"
        max="6"
        onChange={handleModifier}
        value={modifiers.curve}
        name="curve"
      />
      <input
        type="range"
        min="1"
        max="10"
        onChange={handleModifier}
        value={modifiers.peak}
        name="peak"
      />

      <input
        type="range"
        min="2"
        max="10"
        onChange={handleModifier}
        value={modifiers.pathCount}
        name="pathCount"
      />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
