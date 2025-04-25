import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, Suspense } from 'react'
import { Sky, useTexture, Stars } from '@react-three/drei'
import * as THREE from 'three'
import Chat from './Chat'
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaUndoAlt, FaRedoAlt } from 'react-icons/fa'
import "./App.css"
function InfiniteMoonGround() {
  const texture = useTexture('/moon.png')
  texture.anisotropy = 16
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipMapLinearFilter
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  const meshRef = useRef()
  const { camera } = useThree()

  const tileSize = 500
  const repeat = 100

  useFrame(() => {
    if (meshRef.current) {
      const x = Math.floor(camera.position.x / tileSize) * tileSize
      const z = Math.floor(camera.position.z / tileSize) * tileSize
      meshRef.current.position.set(x, 0, z)
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[tileSize * repeat, tileSize * repeat]} />
      <meshStandardMaterial
        map={texture}
        map-repeat={[repeat, repeat]}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function CelestialBody({ textureUrl, position, size }) {
  const [width, height] = size
  const texture = useTexture(textureUrl)
  const spriteRef = useRef()

  useFrame(({ camera }) => {
    if (spriteRef.current) {
      spriteRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <sprite ref={spriteRef} position={position} scale={[width, height, 1]}>
      <spriteMaterial map={texture} />
    </sprite>
  )
}

function CameraController({ direction, rotation, pitch, setCoords }) {
  const [startPosition] = useState([0, 120, 10])
  const { camera } = useThree()
  const speed = 0.5
  const rotationSpeed = 0.02

  if (!camera.userData.initialized) {
    camera.rotation.set(0, 0, 0)
    camera.userData.initialized = true
  }

  useFrame(() => {
    const dir = new THREE.Vector3()
    if (direction === 'forward') dir.z = -speed
    if (direction === 'backward') dir.z = speed
    if (direction === 'left') dir.x = -speed
    if (direction === 'right') dir.x = speed

    dir.applyEuler(camera.rotation)
    const originalY = camera.position.y
    camera.position.add(dir)
    camera.position.y = originalY

    if (rotation === 'left') camera.rotation.y += rotationSpeed
    if (rotation === 'right') camera.rotation.y -= rotationSpeed
    if (pitch === 'up') camera.rotation.x -= rotationSpeed
    if (pitch === 'down') camera.rotation.x += rotationSpeed

    camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x, -Math.PI / 2, Math.PI / 2)

    // Update coordinates
    setCoords({
      x: camera.position.x.toFixed(0),
      y: camera.position.y.toFixed(2)-120,
      z: Math.abs(camera.position.z.toFixed(2))-10,
    })
  })

  return null
}

export default function MoonWalk() {
  const [direction, setDirection] = useState(null)
  const [rotation, setRotation] = useState(null)
  const [pitch, setPitch] = useState(null)
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 })


  return (
    <>
      <audio src="/public/bg-music.mp3" autoPlay loop style={{ display: 'none' }} />

      <Canvas
        shadows
        camera={{ position: [0, 120, 10], fov: 100 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />

        <Stars radius={400} depth={100} count={10000} factor={4} fade />

        <Suspense fallback={null}>
          <InfiniteMoonGround />
          <CelestialBody textureUrl="/earth.png" position={[150, 290, -800]} size={[150, 150]} />
          <CelestialBody textureUrl="/sun.png" position={[-400, 390, -800]} size={[90, 90]} />
          <CelestialBody textureUrl="/body1.png" position={[-200, 70, -300]} size={[200, 100]} />
          <CelestialBody textureUrl="/body1.png" position={[-200, 30, -1000]} size={[200, 100]} />
          <CelestialBody textureUrl="/body1.png" position={[-200, 70, 300]} size={[200, 100]} />
          <CelestialBody textureUrl="/solar.png" position={[200, 66, -400]} size={[80, 40]} />
          <CelestialBody textureUrl="/solar.png" position={[1200, 20, -400]} size={[80, 40]} />
          <CelestialBody textureUrl="/flag.png" position={[0, 66, -400]} size={[90, 150]} />
        </Suspense>

        <CameraController
          direction={direction}
          rotation={rotation}
          pitch={pitch}
          setCoords={setCoords}
        />
      </Canvas>

      {/* Coordinate Display */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '10px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 1000,
      }}>
        <div>X: {coords.x}</div>
        <div>Y: {coords.y}</div>
        <div>Z: {coords.z}</div>
      </div>

      {/* Controls */}
      <Chat/>
    {/* Joystick Controls */ }
<div className='control'>
  <button 
    onMouseDown={() => setPitch('up')} 
    onMouseUp={() => setPitch(null)} 
    onTouchStart={() => setPitch('up')} 
    onTouchEnd={() => setPitch(null)}
  >
    <FaArrowUp />
  </button>

  <button 
    onMouseDown={() => setDirection('forward')} 
    onMouseUp={() => setDirection(null)} 
    onTouchStart={() => setDirection('forward')} 
    onTouchEnd={() => setDirection(null)}
  >
    <FaArrowUp />
  </button>

  <button 
    onMouseDown={() => setPitch('down')} 
    onMouseUp={() => setPitch(null)} 
    onTouchStart={() => setPitch('down')} 
    onTouchEnd={() => setPitch(null)}
  >
    <FaArrowDown />
  </button>

  <button 
    onMouseDown={() => setDirection('left')} 
    onMouseUp={() => setDirection(null)} 
    onTouchStart={() => setDirection('left')} 
    onTouchEnd={() => setDirection(null)}
  >
    <FaArrowLeft />
  </button>

  <div style={{ pointerEvents: 'none' }} />

  <button 
    onMouseDown={() => setDirection('right')} 
    onMouseUp={() => setDirection(null)} 
    onTouchStart={() => setDirection('right')} 
    onTouchEnd={() => setDirection(null)}
  >
    <FaArrowRight />
  </button>

  <button 
    onMouseDown={() => setRotation('left')} 
    onMouseUp={() => setRotation(null)} 
    onTouchStart={() => setRotation('left')} 
    onTouchEnd={() => setRotation(null)}
  >
    <FaUndoAlt />
  </button>

  <button 
    onMouseDown={() => setDirection('backward')} 
    onMouseUp={() => setDirection(null)} 
    onTouchStart={() => setDirection('backward')} 
    onTouchEnd={() => setDirection(null)}
  >
    <FaArrowDown />
  </button>

  <button 
    onMouseDown={() => setRotation('right')} 
    onMouseUp={() => setRotation(null)} 
    onTouchStart={() => setRotation('right')} 
    onTouchEnd={() => setRotation(null)}
  >
    <FaRedoAlt />
  </button>
</div>

      

    </>
  )
}
