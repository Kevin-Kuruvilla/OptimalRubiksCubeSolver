import React from 'react';
import { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'

const state = proxy({
  current: null,
  color: '#ffffff',
  items: {
    top_sticker_0: '#ffffff',
    top_sticker_1: '#ffffff',
    top_sticker_2: '#ffffff',
    top_sticker_3: '#ffffff',
    front_sticker_0: '#ffffff',
    front_sticker_1: '#ffffff',
    front_sticker_2: '#ffffff',
    front_sticker_3: '#ffffff',
    right_sticker_0: '#ffffff',
    right_sticker_1: '#ffffff',
    right_sticker_2: '#ffffff',
    right_sticker_3: '#ffffff',
    back_sticker_0: '#ffffff',
    back_sticker_1: '#ffffff',
    back_sticker_2: '#ffffff',
    back_sticker_3: '#ffffff',
    left_sticker_0: '#ffffff',
    left_sticker_1: '#ffffff',
    left_sticker_2: '#ffffff',
    left_sticker_3: '#ffffff',
    bottom_sticker_0: '#ffffff',
    bottom_sticker_1: '#ffffff',
    bottom_sticker_2: '#ffffff',
    bottom_sticker_3: '#ffffff'
  },
  solutionPath: null
})

function RubiksCube(props) {
  const ref = useRef()
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF('cube.glb')
  const [hovered, set] = useState(null)
  const color = snap.color

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.1 - (1 + Math.sin(t / 1.5)) / 20)
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 5
  })

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  })

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      onPointerOver={(event) => {
        event.stopPropagation()
        set(event.object.material.name)
        event.object.material.color.multiplyScalar(1 / 2)
      }}
      onPointerOut={(event) => {
        event.intersections.length === 0 && set(null)
        const name = event.object.material.name
        if (name === 'rubiks_cube') return
        event.object.material.color.set(state.items[name])
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        const name = event.object.material.name
        if (name === 'rubiks_cube') return
        state.current = name
        state.items[state.current] = color
        state.solutionPath = null
      }}
      onPointerMissed={() => {
        state.current = null
      }}>
      <mesh geometry={nodes.rubiks_cube_1.geometry} material={materials.rubiks_cube} />
      <mesh material-color={snap.items.left_sticker_3} geometry={nodes.rubiks_cube_2.geometry} material={materials.left_sticker_3} />
      <mesh material-color={snap.items.back_sticker_2} geometry={nodes.rubiks_cube_3.geometry} material={materials.back_sticker_2} />
      <mesh material-color={snap.items.bottom_sticker_3} geometry={nodes.rubiks_cube_4.geometry} material={materials.bottom_sticker_3} />
      <mesh material-color={snap.items.left_sticker_2} geometry={nodes.rubiks_cube_5.geometry} material={materials.left_sticker_2} />
      <mesh material-color={snap.items.bottom_sticker_0} geometry={nodes.rubiks_cube_6.geometry} material={materials.bottom_sticker_0} />
      <mesh material-color={snap.items.front_sticker_3} geometry={nodes.rubiks_cube_7.geometry} material={materials.front_sticker_3} />
      <mesh material-color={snap.items.back_sticker_3} geometry={nodes.rubiks_cube_8.geometry} material={materials.back_sticker_3} />
      <mesh material-color={snap.items.bottom_sticker_2} geometry={nodes.rubiks_cube_9.geometry} material={materials.bottom_sticker_2} />
      <mesh material-color={snap.items.bottom_sticker_1} geometry={nodes.rubiks_cube_10.geometry} material={materials.bottom_sticker_1} />
      <mesh material-color={snap.items.front_sticker_2} geometry={nodes.rubiks_cube_11.geometry} material={materials.front_sticker_2} />
      <mesh material-color={snap.items.right_sticker_2} geometry={nodes.rubiks_cube_12.geometry} material={materials.right_sticker_2} />
      <mesh material-color={snap.items.right_sticker_3} geometry={nodes.rubiks_cube_13.geometry} material={materials.right_sticker_3} />
      <mesh material-color={snap.items.left_sticker_0} geometry={nodes.rubiks_cube_14.geometry} material={materials.left_sticker_0} />
      <mesh material-color={snap.items.back_sticker_1} geometry={nodes.rubiks_cube_15.geometry} material={materials.back_sticker_1} />
      <mesh material-color={snap.items.left_sticker_1} geometry={nodes.rubiks_cube_16.geometry} material={materials.left_sticker_1} />
      <mesh material-color={snap.items.front_sticker_0} geometry={nodes.rubiks_cube_17.geometry} material={materials.front_sticker_0} />
      <mesh material-color={snap.items.back_sticker_0} geometry={nodes.rubiks_cube_18.geometry} material={materials.back_sticker_0} />
      <mesh material-color={snap.items.front_sticker_1} geometry={nodes.rubiks_cube_19.geometry} material={materials.front_sticker_1} />
      <mesh material-color={snap.items.right_sticker_1} geometry={nodes.rubiks_cube_20.geometry} material={materials.right_sticker_1} />
      <mesh material-color={snap.items.right_sticker_0} geometry={nodes.rubiks_cube_21.geometry} material={materials.right_sticker_0} />
      <mesh material-color={snap.items.top_sticker_0} geometry={nodes.rubiks_cube_22.geometry} material={materials.top_sticker_0} />
      <mesh material-color={snap.items.top_sticker_3} geometry={nodes.rubiks_cube_23.geometry} material={materials.top_sticker_3} />
      <mesh material-color={snap.items.top_sticker_1} geometry={nodes.rubiks_cube_24.geometry} material={materials.top_sticker_1} />
      <mesh material-color={snap.items.top_sticker_2} geometry={nodes.rubiks_cube_25.geometry} material={materials.top_sticker_2} />
    </group>
  )
}

function verifyColors(snap) {
  const colorsCount = {
    '#ffffff': 0,
    '#009b48': 0,
    '#b71234': 0,
    '#0046ad': 0,
    '#ff5800': 0,
    '#ffd500': 0
  }

  // Iterate through the 'snap.items' object and count occurrences of each color
  for (const key in snap.items) {
    if (snap.items.hasOwnProperty(key)) {
      const color = snap.items[key]
      if (colorsCount[color] !== undefined) {
        colorsCount[color]++
      }
    }
  }

  for (const color in colorsCount) {
    if (colorsCount[color] !== 4) {
      return false
    }
  }
  return true
}

export default function App() {
  const snap = useSnapshot(state)
  const colors = ['#ffffff', '#009b48', '#b71234', '#0046ad', '#ff5800', '#ffd500']
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [isValidScramble, setIsValidScramble] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const changeColor = (color) => {
    state.color = color
    setSelectedColor(color)
  }

  useEffect(() => {
    const isValid = verifyColors(snap)
    setIsValidScramble(isValid)
  }, [snap.items])

  const sendState = async (snap) => {
    let scrambleState = {
      top: {},
      front: {},
      right: {},
      back: {},
      left: {},
      bottom: {}
    }

    const colorMapping = {
      "#ffffff": "W", // White
      "#009b48": "G", // Green
      "#0046ad": "B", // Blue
      "#b71234": "R", // Red
      "#ff5800": "O", // Orange
      "#ffd500": "Y"  // Yellow
    };
  
    for (const key in snap.items) {
      const value = snap.items[key]
      const side = key.split('_')[0]
      scrambleState[side][key] = colorMapping[value]
    }

    console.log(JSON.stringify(scrambleState))

    fetch('https://optimal-rubiks-cube-solver-api.vercel.app/api/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scrambleState),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid scramble. Please try again.')
      }
      return response.json()
    })
    .then(data => {
      state.solutionPath = data
      setCurrentIndex(0)
      navigateToState(0)
      console.log(JSON.stringify(state.solutionPath))
    })
    .catch((error) => {
      console.error('Error:', error)
      alert(error.message)
    });
  }

  const previousState = async () => {
    if (!state.solutionPath || currentIndex <= 0) {
      console.log("No previous states or solutionPath is undefined");
      return;
    }

    const previousStateIndex = currentIndex - 1;
    setCurrentIndex(previousStateIndex);
    const previousState = state.solutionPath[previousStateIndex.toString()];
  
    if (previousState) {
      for (const side in previousState) {
        if (side === "move") continue
        for (const sticker in previousState[side]) {
          state.items[sticker] = previousState[side][sticker]
        }
      }
    }
  };

  const nextState = async () => {
    if (!state.solutionPath || currentIndex >= Object.keys(state.solutionPath).length - 1) {
      console.log("No more states or solutionPath is undefined");
      return;
    }

    const nextStateIndex = currentIndex + 1;
    setCurrentIndex(nextStateIndex);
    const nextState = state.solutionPath[nextStateIndex.toString()];

    if (nextState) {
      for (const side in nextState) {
        if (side === "move") continue
        for (const sticker in nextState[side]) {
          state.items[sticker] = nextState[side][sticker]
        }
      }
    }
  };

  const navigateToState = (index) => {
    setCurrentIndex(index);
    const targetState = state.solutionPath[index.toString()];

    if (targetState) {
      for (const side in targetState) {
        if (side === "move") continue
        for (const sticker in targetState[side]) {
          state.items[sticker] = targetState[side][sticker];
        }
      }
    }
  };

  const renderDots = () => {
    const solutionPathLength = state.solutionPath ? Object.keys(state.solutionPath).length : 0;
    return (
      <ul className="dotstyle dotstyle-scaleup">
        {Array.from({ length: solutionPathLength }, (_, i) => (
          <li key={i} className={currentIndex === i ? 'current' : ''}>
            <div onClick={() => navigateToState(i)}>
              {currentIndex === i && (
                <span className="dot-text">{state.solutionPath[currentIndex.toString()]["move"]}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") {
        nextState();
      } else if (event.key === "ArrowLeft") {
        previousState();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [nextState, previousState]);

  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [10, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.3} position={[5, 20, 20]} />
        <Suspense fallback={null}>
          <RubiksCube />
          <Environment preset="city" />
          <ContactShadows position={[0, -6.5, 0]} scale={100} />
        </Suspense>
        <OrbitControls minPolarAngle={Math.PI / 4} maxPolarAngle={(3 * Math.PI) / 4} enableZoom={false} enablePan={false} />
      </Canvas>

      {snap.solutionPath ? (
      <div className={`solve-button-container ${isValidScramble ? 'show' : ''}`}>
        <nav className="nav-circlepop">
          <div className="prev" onClick={previousState}>
            <span className="icon-wrap"></span>
          </div>
          {renderDots()}
          <div className="next" onClick={nextState}>
            <span className="icon-wrap"></span>
          </div>
        </nav>
      </div>
      
      ) : (
        <>
          <div className={`color-button-container ${snap.current ? 'show' : ''}`}>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => changeColor(color)}
                className={selectedColor === color ? 'selected' : ''}
                style={{ background: color }}
              />
            ))}
          </div>
          <div className={`solve-button-container ${isValidScramble ? 'show' : ''}`}>
            <button onClick={() => sendState(snap)}>solve</button>
          </div>
        </>
      )}
    </div>
  )
}
