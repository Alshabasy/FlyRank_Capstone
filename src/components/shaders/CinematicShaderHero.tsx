import { useEffect, useRef, useState } from 'react'

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 v_uv;

// ---------- 1. Coordinate normalization & aspect correction ----------
// UV is passed from the vertex shader in [0,1] range (bottom-left origin).
// We center it to [-aspect, aspect] x [-1, 1] so patterns remain
// compositionally stable regardless of viewport width/height.

// ---------- 5. Procedural noise primitives ----------
// Simple 2D value-noise hash — no texture reads, deterministic, fast.
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion — layered noise for richer cinematic detail.
// 4 octaves kept intentionally low to avoid shader cost blowups.
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    v += amp * valueNoise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return v;
}

void main() {
  // ---------- 2. Aspect-ratio correction ----------
  // Convert from [0,1] UV to centered coordinates with aspect ratio applied.
  // Without this the aurora would visibly stretch on wide vs narrow viewports.
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 uv = (v_uv - 0.5) * 2.0;
  uv.x *= aspect;

  // ---------- 3. Time-based animation (slow, deliberate) ----------
  // Time is deliberately decelerated (x0.08) so motion reads as ambient
  // cinematic atmosphere rather than distracting visual noise.
  float slowTime = u_time * 0.08;

  // ---------- 4. Mouse influence ----------
  // Mouse is normalized to [-1,1] with aspect correction matching UV space.
  // Influence is a gentle parallax pull toward the cursor — never violent.
  vec2 mouseNdc = (u_mouse - 0.5) * 2.0;
  mouseNdc.x *= aspect;
  // Smoothly interpolate mouse so fast flicks don't cause jarring jumps.
  vec2 mousePull = mouseNdc * 0.15;

  // Dual-layer aurora fields offset by the mouse parallax.
  vec2 fieldA = uv * 1.6 + vec2(slowTime * 0.4, slowTime * 0.25) + mousePull;
  vec2 fieldB = uv * 2.2 + vec2(-slowTime * 0.3, slowTime * 0.5) - mousePull * 1.4;

  float noiseA = fbm(fieldA + fbm(fieldB * 0.7));
  float noiseB = fbm(fieldB + fbm(fieldA * 0.6 + slowTime * 0.3));

  // Warp the combined field into flowing aurora bands.
  float aurora = smoothstep(0.3, 0.75, noiseA) * (1.0 - smoothstep(0.55, 0.95, noiseB));

  // ---------- 6. Color palette ----------
  // Project-specific palette tied to CineVault's brand:
  //   cinema-red   #e50914   → accent highlights
  //   cinema-blue  #1d4ed8   → primary aurora body
  //   deep indigo  #0a0e27   → base film dark
  //   cool purple  #5b21b6   → secondary aurora wash
  vec3 deepSpace = vec3(0.031, 0.035, 0.055);
  vec3 auroraBlue = vec3(0.114, 0.306, 0.847);
  vec3 auroraPurple = vec3(0.357, 0.129, 0.714);
  vec3 auroraRed = vec3(0.898, 0.035, 0.078);

  // Mix three bands using the dual noise masks for depth and color separation.
  vec3 color = deepSpace;
  color = mix(color, auroraBlue, smoothstep(0.25, 0.55, aurora) * 0.9);
  color = mix(color, auroraPurple, smoothstep(0.45, 0.75, noiseA * noiseB) * 0.55);
  color = mix(color, auroraRed, smoothstep(0.7, 0.95, noiseA * 0.8 + noiseB * 0.2) * 0.35);

  // Film-grain atmosphere — very subtle, one hash per pixel.
  // Grain adds cinematic texture and prevents banding on low-bit panels.
  float grain = hash21(gl_FragCoord.xy + u_time * 0.001) * 0.035;
  color += (grain - 0.0175);

  // ---------- 7. Contrast / vignette ----------
  // Radial vignette darkens edges: draws eye to center content,
  // mimics a cinematic lens, and improves text contrast at the periphery.
  vec2 vignetteUv = v_uv - 0.5;
  float vignette = 1.0 - smoothstep(0.6, 1.15, dot(vignetteUv, vignetteUv) * 4.0);
  color *= mix(0.55, 1.0, vignette);

  // Slight contrast lift so blacks feel like true film blacks.
  color = pow(color, vec3(0.92));

  // ---------- 8. Final output ----------
  // Alpha at 1.0 — this shader IS the hero background; gradient fallbacks
  // are handled in React, not via fragment alpha blending.
  gl_FragColor = vec4(color, 1.0);
}
`

interface GlState {
  gl: WebGLRenderingContext
  program: WebGLProgram
  buffers: {
    position: WebGLBuffer
  }
  uniforms: {
    time: WebGLUniformLocation | null
    resolution: WebGLUniformLocation | null
    mouse: WebGLUniformLocation | null
  }
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[CinematicShader] shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initGl(canvas: HTMLCanvasElement): GlState | null {
  const glAttrs: WebGLContextAttributes = {
    antialias: true,
    alpha: false,
    premultipliedAlpha: false,
    powerPreference: 'high-performance',
  }
  const gl =
    canvas.getContext('webgl', glAttrs) ||
    (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
  if (!gl) return null

  const vert = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  if (!vert || !frag) return null

  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[CinematicShader] program link error:', gl.getProgramInfoLog(program))
    return null
  }
  gl.deleteShader(vert)
  gl.deleteShader(frag)

  const positionBuf = gl.createBuffer()
  if (!positionBuf) return null
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )

  return {
    gl,
    program,
    buffers: { position: positionBuf },
    uniforms: {
      time: gl.getUniformLocation(program, 'u_time'),
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
    },
  }
}

function detectReducedMotionOrNoWebgl(): boolean {
  if (typeof window === 'undefined') return false
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (mq.matches) return true
  try {
    const canvas = document.createElement('canvas')
    const has = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
    return !has
  } catch {
    return true
  }
}

export default function CinematicShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Synchronous browser detection in a lazy initializer avoids the
  // cascading-render lint hazard of calling setState() directly in the
  // effect body. Safe in Vite SPA (never SSR'd).
  const [webglFailed, setWebglFailed] = useState<boolean>(detectReducedMotionOrNoWebgl)

  useEffect(() => {
    const containerFromRef = containerRef.current
    const canvasFromRef = canvasRef.current
    if (!containerFromRef || !canvasFromRef) return
    if (webglFailed) return

    // ---------- Device Pixel Ratio cap ----------
    // Native DPR on modern phones can be 3x–4x which wastes fill-rate on a
    // fullscreen fragment shader. 1.5x is a justified sweet spot: the
    // perceptual difference to 2x is minimal for a procedural aurora, but
    // the fragment count drops by ~44% vs 2x and ~75% vs 3x.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const state = initGl(canvasFromRef)
    if (!state) {
      setWebglFailed(true)
      return
    }
    const { gl, program, buffers, uniforms } = state

    // Assign to locals that TypeScript can prove to be non-null across all
    // closures used in the effect (refs may detach, but the DOM nodes we
    // captured above stay valid for the effect lifetime via the observer).
    const container: HTMLDivElement = containerFromRef
    const canvas: HTMLCanvasElement = canvasFromRef

    let rafId = 0
    let lastVisibleTimestamp = performance.now()
    let accumulatedTime = 0
    let isHidden = document.visibilityState === 'hidden'

    // Target CSS size of the canvas element (not device pixels).
    let currentCssW = 0
    let currentCssH = 0

    // Smooth, damped mouse position in normalized [0,1] canvas space.
    // Initialized to 0.5,0.5 (center) so touch-only / no-mouse devices have
    // a neutral, aesthetically pleasing default instead of the top-left corner.
    let targetMouseX = 0.5
    let targetMouseY = 0.5
    let currentMouseX = 0.5
    let currentMouseY = 0.5

    function resizeIfNeeded() {
      const rect = container.getBoundingClientRect()
      const cssW = Math.max(1, Math.floor(rect.width))
      const cssH = Math.max(1, Math.floor(rect.height))
      if (cssW === currentCssW && cssH === currentCssH) return
      currentCssW = cssW
      currentCssH = cssH
      canvas.width = Math.floor(cssW * dpr)
      canvas.height = Math.floor(cssH * dpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const resizeObserver = new ResizeObserver(() => resizeIfNeeded())
    resizeObserver.observe(container)
    resizeIfNeeded()

    function handlePointerMove(e: PointerEvent) {
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      // Clamp to [0,1] so cursor outside the hero area doesn't pull extremes.
      targetMouseX = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      // Flip Y: GL's Y grows upward, DOM Y grows downward.
      targetMouseY = 1 - Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
    }

    function handlePointerLeave() {
      // Drift back to neutral center when the pointer leaves the hero section.
      targetMouseX = 0.5
      targetMouseY = 0.5
    }

    function handleVisibilityChange() {
      const nowHidden = document.visibilityState === 'hidden'
      if (!isHidden && nowHidden) {
        // Tab is hiding — freeze time so we don't fast-forward later.
        isHidden = true
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = 0
        }
      } else if (isHidden && !nowHidden) {
        // Tab is showing again — reset the timestamp baseline so the
        // shader doesn't jump from a minutes-long time delta.
        isHidden = false
        lastVisibleTimestamp = performance.now()
        loop(lastVisibleTimestamp)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    function drawFrame() {
      resizeIfNeeded()

      gl.useProgram(program)

      // Bind fullscreen quad.
      const posLoc = gl.getAttribLocation(program, 'a_position')
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

      // Damped mouse lerp at ~8% per frame (≈400ms to converge) — responsive
      // but soft enough that cursor jitter never reads as shader noise.
      currentMouseX += (targetMouseX - currentMouseX) * 0.08
      currentMouseY += (targetMouseY - currentMouseY) * 0.08

      // Uniforms: pass actual render resolution (device pixels) so aspect
      // correction and grain both work against real pixel coordinates.
      if (uniforms.resolution != null) {
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
      }
      if (uniforms.time != null) {
        gl.uniform1f(uniforms.time, accumulatedTime)
      }
      if (uniforms.mouse != null) {
        gl.uniform2f(uniforms.mouse, currentMouseX, currentMouseY)
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    function loop(timestamp: number) {
      const delta = Math.min(0.05, (timestamp - lastVisibleTimestamp) / 1000)
      lastVisibleTimestamp = timestamp
      accumulatedTime += delta

      drawFrame()

      if (!isHidden) {
        rafId = requestAnimationFrame(loop)
      }
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      try {
        gl.deleteProgram(program)
        gl.deleteBuffer(buffers.position)
      } catch {
        /* clean up on best-effort basis */
      }
    }
  }, [webglFailed])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      {webglFailed ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(29,78,216,0.35),_transparent_55%),radial-gradient(ellipse_at_80%_70%,_rgba(229,9,20,0.25),_transparent_60%),linear-gradient(180deg,_#08080f_0%,_#0a0e27_50%,_#08080f_100%)]" />
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            display: 'block',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
