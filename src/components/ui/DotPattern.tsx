"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { cn } from "@/lib/utils"

export interface DotPatternProps {
  className?: string
  children?: React.ReactNode
  /** Dot diameter in pixels */
  dotSize?: number
  /** Gap between dots in pixels */
  gap?: number
  /** Base dot color (hex) */
  baseColor?: string
  /** Glow color on hover (hex) */
  glowColor?: string
  /** Mouse proximity radius for highlighting */
  proximity?: number
  /** Glow intensity multiplier */
  glowIntensity?: number
  /** Wave animation speed (0 to disable) */
  waveSpeed?: number
  /** Enable content-aware glow masking */
  enableGlowMasking?: boolean
  /** Z-index for dot layer */
  dotZIndex?: number
  /** Z-index for glow layer */
  glowZIndex?: number
  /** Scatter/repulsion force strength (0 = disabled, 4–8 feels good) */
  scatterStrength?: number
  /** Theme variant — controls vignette overlay */
  variant?: 'dark' | 'light'
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

interface Dot {
  x: number        // current (displaced) position
  y: number
  ox: number       // rest/origin position
  oy: number
  vx: number       // velocity
  vy: number
  baseOpacity: number
}

// Spring constants — tweak here if needed
const SPRING_K  = 0.07   // stiffness pulling back to origin
const DAMPING   = 0.82   // velocity decay per frame (lower = bouncier)

export function DotPattern({
  className,
  children,
  dotSize = 2,
  gap = 24,
  baseColor = "#404040",
  glowColor = "#CCFF00",
  proximity = 120,
  glowIntensity = 1,
  waveSpeed = 0.5,
  enableGlowMasking = true,
  dotZIndex = 1,
  glowZIndex = 2,
  scatterStrength = 0,
  variant = 'dark',
}: DotPatternProps) {
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const glowCanvasRef  = useRef<HTMLCanvasElement>(null)
  const containerRef   = useRef<HTMLDivElement>(null)
  const dotsRef        = useRef<Dot[]>([])
  const mouseRef       = useRef({ x: -9999, y: -9999 })
  const animationRef      = useRef<number | undefined>(undefined)
  const glowAnimationRef  = useRef<number | undefined>(undefined)
  const startTimeRef   = useRef(Date.now())
  const contentAreasRef = useRef<Set<Element>>(new Set())

  const isOverContent = useCallback((x: number, y: number) => {
    if (!enableGlowMasking) return false
    const elements = document.elementsFromPoint(x, y)
    return elements.some(el =>
      contentAreasRef.current.has(el) ||
      el.classList.contains('glass') ||
      el.classList.contains('card') ||
      el.classList.contains('hover-glow')
    )
  }, [enableGlowMasking])

  useEffect(() => {
    if (!enableGlowMasking) return
    const update = () => {
      const els = document.querySelectorAll('.glass, .card, .hover-glow, [data-content-area]')
      contentAreasRef.current = new Set(els)
    }
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [enableGlowMasking])

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor])
  const glowRgb = useMemo(() => hexToRgb(glowColor), [glowColor])

  const buildGrid = useCallback(() => {
    const canvas     = canvasRef.current
    const glowCanvas = glowCanvasRef.current
    const container  = containerRef.current
    if (!canvas || !glowCanvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr  = window.devicePixelRatio || 1

    for (const c of [canvas, glowCanvas]) {
      c.width        = rect.width  * dpr
      c.height       = rect.height * dpr
      c.style.width  = `${rect.width}px`
      c.style.height = `${rect.height}px`
    }

    const ctx     = canvas.getContext("2d")
    const glowCtx = glowCanvas.getContext("2d")
    if (ctx)     ctx.scale(dpr, dpr)
    if (glowCtx) glowCtx.scale(dpr, dpr)

    const cellSize = dotSize + gap
    const cols = Math.ceil(rect.width  / cellSize) + 1
    const rows = Math.ceil(rect.height / cellSize) + 1
    const offsetX = (rect.width  - (cols - 1) * cellSize) / 2
    const offsetY = (rect.height - (rows - 1) * cellSize) / 2

    const dots: Dot[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ox = offsetX + col * cellSize
        const oy = offsetY + row * cellSize
        dots.push({ x: ox, y: oy, ox, oy, vx: 0, vy: 0, baseOpacity: 0.3 + Math.random() * 0.2 })
      }
    }
    dotsRef.current = dots
  }, [dotSize, gap])

  // ─── Base dot canvas (also runs physics) ────────────────────────────────────
  const drawDots = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr  = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    const time = (Date.now() - startTimeRef.current) * 0.001 * waveSpeed
    const { x: mx, y: my } = mouseRef.current
    const scatterRadiusSq = proximity * proximity * 1.5 // slightly wider than glow

    for (const dot of dotsRef.current) {
      // ── Scatter physics ────────────────────────────────────────────────────
      if (scatterStrength > 0) {
        const dx = dot.x - mx
        const dy = dot.y - my
        const distSq = dx * dx + dy * dy

        if (distSq < scatterRadiusSq && distSq > 0.01) {
          const dist  = Math.sqrt(distSq)
          const r     = Math.sqrt(scatterRadiusSq)
          const t     = 1 - dist / r
          const force = scatterStrength * t * t    // quadratic falloff
          dot.vx += (dx / dist) * force
          dot.vy += (dy / dist) * force
        }

        // Spring toward origin
        dot.vx += (dot.ox - dot.x) * SPRING_K
        dot.vy += (dot.oy - dot.y) * SPRING_K

        // Damping
        dot.vx *= DAMPING
        dot.vy *= DAMPING

        // Integrate
        dot.x += dot.vx
        dot.y += dot.vy
      }

      // ── Wave + draw ────────────────────────────────────────────────────────
      const wave      = Math.sin(dot.ox * 0.02 + dot.oy * 0.02 + time) * 0.5 + 0.5
      const opacity   = dot.baseOpacity + wave * 0.15
      const scale     = 1 + wave * 0.2
      const radius    = (dotSize / 2) * scale

      ctx.beginPath()
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${opacity})`
      ctx.fill()
    }

    animationRef.current = requestAnimationFrame(drawDots)
  }, [baseRgb, dotSize, waveSpeed, scatterStrength, proximity])

  // ─── Glow canvas ─────────────────────────────────────────────────────────────
  const drawGlow = useCallback(() => {
    const canvas = glowCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    const { x: mx, y: my } = mouseRef.current
    const proxSq = proximity * proximity
    const intensityMultiplier = isOverContent(mx + window.scrollX, my + window.scrollY) ? 0.2 : 1.0

    for (const dot of dotsRef.current) {
      // Use displaced position so glow follows the scattered dot
      const dx = dot.x - mx
      const dy = dot.y - my
      const distSq = dx * dx + dy * dy

      if (distSq < proxSq) {
        const dist    = Math.sqrt(distSq)
        const t       = 1 - dist / proximity
        const easedT  = t * t * (3 - 2 * t)
        const glow    = easedT * glowIntensity * intensityMultiplier
        const scale   = 1 + easedT * 0.8
        const radius  = (dotSize / 2) * scale

        if (glow > 0.01) {
          const glowRadius = radius * 2.8
          const gradient   = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, glowRadius)
          gradient.addColorStop(0,   `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 1.0})`)
          gradient.addColorStop(0.3, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.7})`)
          gradient.addColorStop(0.6, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.3})`)
          gradient.addColorStop(1,   `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0)`)

          ctx.beginPath()
          ctx.arc(dot.x, dot.y, glowRadius, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }
      }
    }

    glowAnimationRef.current = requestAnimationFrame(drawGlow)
  }, [proximity, glowRgb, dotSize, glowIntensity, isOverContent])

  useEffect(() => {
    buildGrid()
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(buildGrid)
    ro.observe(container)
    return () => ro.disconnect()
  }, [buildGrid])

  useEffect(() => {
    animationRef.current     = requestAnimationFrame(drawDots)
    glowAnimationRef.current = requestAnimationFrame(drawGlow)
    return () => {
      if (animationRef.current)     cancelAnimationFrame(animationRef.current)
      if (glowAnimationRef.current) cancelAnimationFrame(glowAnimationRef.current)
    }
  }, [drawDots, drawGlow])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseleave", handleLeave)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn("fixed inset-0 overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ zIndex: dotZIndex }}
      />
      <canvas
        ref={glowCanvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ zIndex: glowZIndex }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 3,
          background: variant === 'light'
            ? "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(248,250,252,0.5) 80%, rgba(248,250,252,1) 100%)"
            : "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(10,10,10,0.6) 100%)",
        }}
      />
      {children && (
        <div className="relative z-10 h-full w-full pointer-events-auto">{children}</div>
      )}
    </div>
  )
}

export default function DotPatternDemo() {
  return <DotPattern />
}
