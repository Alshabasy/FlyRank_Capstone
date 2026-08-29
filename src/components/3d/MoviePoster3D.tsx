/// <reference types="@react-three/fiber" />
import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface Poster3DProps {
  title?: string
  genre?: string
  rating?: string
  isReducedMotion?: boolean
}

function InteractivePoster({ title = 'CINEVAULT ORIGINALS', genre = 'Sci-Fi / Action', rating = '9.8', isReducedMotion = false }: Poster3DProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [mode, setMode] = useState<'neon' | 'gold'>('neon')

  // Smooth rotation & pointer tilt animation
  useFrame((state) => {
    if (!meshRef.current) return

    // Target rotation based on flipped state
    const targetY = flipped ? Math.PI : 0

    if (!isReducedMotion) {
      // Mouse tilt tracking
      const mouseX = (state.pointer.x * Math.PI) / 8
      const mouseY = (state.pointer.y * Math.PI) / 8

      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -mouseY, 0.1)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY + mouseX, 0.1)
    } else {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, 0.1)
      meshRef.current.rotation.x = 0
    }
  })

  const primaryColor = mode === 'neon' ? '#e50914' : '#f59e0b'
  const accentColor = mode === 'neon' ? '#1d4ed8' : '#d97706'

  return (
    <Float speed={isReducedMotion || hovered ? 0 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          setFlipped((prev) => !prev)
          setMode((prev) => (prev === 'neon' ? 'gold' : 'neon'))
        }}
      >
        {/* Main Card Geometry */}
        <RoundedBox args={[3.2, 4.6, 0.2]} radius={0.12} smoothness={4}>
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.2}
            metalness={0.8}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        {/* Front Poster Content */}
        <group position={[0, 0, 0.11]}>
          {/* Glowing Border Trim */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[3.0, 4.4]} />
            <meshBasicMaterial color={primaryColor} transparent opacity={hovered ? 0.9 : 0.4} />
          </mesh>

          {/* Inner Poster Background */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.9, 4.3]} />
            <meshStandardMaterial color="#08080f" roughness={0.4} />
          </mesh>

          {/* Decorative Film Reel Icon / Emblems */}
          <mesh position={[0, 0.8, 0.02]}>
            <torusGeometry args={[0.5, 0.08, 16, 32]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
          </mesh>

          {/* Title Text */}
          <Text
            position={[0, -0.4, 0.03]}
            fontSize={0.24}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.6}
            textAlign="center"
          >
            {title}
          </Text>

          {/* Genre Pill */}
          <Text
            position={[0, -0.9, 0.03]}
            fontSize={0.14}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
          >
            {genre}
          </Text>

          {/* Rating Badge */}
          <Text
            position={[0, -1.4, 0.03]}
            fontSize={0.16}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
          >
            ★ {rating} / 10
          </Text>

          <Text
            position={[0, -1.9, 0.03]}
            fontSize={0.1}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            (Click card to inspect back details)
          </Text>
        </group>

        {/* Back Card Details */}
        <group position={[0, 0, -0.11]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.9, 4.3]} />
            <meshStandardMaterial color="#111827" roughness={0.3} />
          </mesh>

          <Text
            position={[0, 1.2, 0.03]}
            fontSize={0.22}
            color={primaryColor}
            anchorX="center"
            anchorY="middle"
          >
            CineVault 3D Feature
          </Text>

          <Text
            position={[0, 0.3, 0.03]}
            fontSize={0.13}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.5}
            textAlign="center"
          >
            Interactive WebGL 3D Poster rendered in real-time. Features spring lighting, cursor tilt reactivity, and reduced-motion fallback safety.
          </Text>

          <Text
            position={[0, -1.2, 0.03]}
            fontSize={0.12}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            Mode: {mode.toUpperCase()} LIGHTING
          </Text>

          <Text
            position={[0, -1.7, 0.03]}
            fontSize={0.1}
            color="#64748b"
            anchorX="center"
            anchorY="middle"
          >
            Click to flip back
          </Text>
        </group>
      </group>
    </Float>
  )
}

function WebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

export default function MoviePoster3DCanvas({ className = '' }: { className?: string }) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setHasWebGL(WebGLSupported())
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (hasWebGL === false) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 rounded-2xl bg-cinema-dark border border-white/10 text-center ${className}`}>
        <div className="w-20 h-28 rounded-lg bg-gradient-to-tr from-cinema-red to-cinema-blue flex items-center justify-center shadow-lg mb-4">
          <span className="text-2xl">🎬</span>
        </div>
        <h3 className="text-lg font-bold text-white">3D Cinema Showcase</h3>
        <p className="text-xs text-cinema-muted mt-1 max-w-xs">
          WebGL acceleration unavailable. Showing static high-contrast fallback representation.
        </p>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden bg-cinema-black/40 border border-white/10 ${className}`}>
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-cinema-dark/80 text-cinema-muted text-sm font-medium animate-pulse">
            Loading 3D Cinema Experience...
          </div>
        }
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          aria-label="Interactive 3D Movie Poster Canvas"
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#1d4ed8" />
          <pointLight position={[5, -5, 5]} intensity={0.8} color="#e50914" />
          <InteractivePoster isReducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-cinema-muted pointer-events-none px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md">
        <span>🖱️ Hover to tilt · Click to flip poster</span>
        <span className="font-mono text-cinema-red">R3F 3D Engine</span>
      </div>
    </div>
  )
}
