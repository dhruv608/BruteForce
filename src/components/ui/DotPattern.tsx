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
  x: number
  y: number
  baseOpacity: number
}

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
}: DotPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationRef = useRef<number | undefined>(undefined)
  const glowAnimationRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef(Date.now())
  const contentAreasRef = useRef<Set<Element>>(new Set())

  // Check if mouse is over content area
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

  // Update content areas when children change
  useEffect(() => {
    if (!enableGlowMasking) return
    
    const updateContentAreas = () => {
      const contentElements = document.querySelectorAll('.glass, .card, .hover-glow, [data-content-area]')
      contentAreasRef.current = new Set(contentElements)
    }
    
    updateContentAreas()
    
    // Watch for dynamic content changes
    const observer = new MutationObserver(updateContentAreas)
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => observer.disconnect()
  }, [enableGlowMasking])

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor])
  const glowRgb = useMemo(() => hexToRgb(glowColor), [glowColor])

  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current
    const glowCanvas = glowCanvasRef.current
    const container = containerRef.current
    if (!canvas || !glowCanvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    // Setup dot canvas
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px` 
    canvas.style.height = `${rect.height}px`
    
    // Setup glow canvas
    glowCanvas.width = rect.width * dpr
    glowCanvas.height = rect.height * dpr
    glowCanvas.style.width = `${rect.width}px`
    glowCanvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext("2d")
    const glowCtx = glowCanvas.getContext("2d")
    if (ctx) ctx.scale(dpr, dpr)
    if (glowCtx) glowCtx.scale(dpr, dpr)

    const cellSize = dotSize + gap
    const cols = Math.ceil(rect.width / cellSize) + 1
    const rows = Math.ceil(rect.height / cellSize) + 1

    const offsetX = (rect.width - (cols - 1) * cellSize) / 2
    const offsetY = (rect.height - (rows - 1) * cellSize) / 2

    const dots: Dot[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: offsetX + col * cellSize,
          y: offsetY + row * cellSize,
          baseOpacity: 0.3 + Math.random() * 0.2,
        })
      }
    }
    dotsRef.current = dots
  }, [dotSize, gap])

  // Draw dots only (no glow)
  const drawDots = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    const time = (Date.now() - startTimeRef.current) * 0.001 * waveSpeed

    for (const dot of dotsRef.current) {
      // Wave animation
      const wave = Math.sin(dot.x * 0.02 + dot.y * 0.02 + time) * 0.5 + 0.5
      const waveOpacity = dot.baseOpacity + wave * 0.15
      const waveScale = 1 + wave * 0.2

      const opacity = waveOpacity
      const scale = waveScale
      const radius = (dotSize / 2) * scale

      // Draw dot only
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${opacity})` 
      ctx.fill()
    }

    animationRef.current = requestAnimationFrame(drawDots)
  }, [baseRgb, dotSize, waveSpeed])

  // Draw glow effect with content masking
  const drawGlow = useCallback(() => {
    const canvas = glowCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    const { x: mx, y: my } = mouseRef.current
    const proxSq = proximity * proximity
    
    // Check if mouse is over content area
    const isOverContentArea = isOverContent(mx + window.scrollX, my + window.scrollY)
    const intensityMultiplier = isOverContentArea ? 0.2 : 1.0

    for (const dot of dotsRef.current) {
      const dx = dot.x - mx
      const dy = dot.y - my
      const distSq = dx * dx + dy * dy

      // Mouse proximity effect
      if (distSq < proxSq) {
        const dist = Math.sqrt(distSq)
        const t = 1 - dist / proximity
        const easedT = t * t * (3 - 2 * t) // smoothstep
        
        const glow = easedT * glowIntensity * intensityMultiplier
        const scale = 1 + easedT * 0.8
        const radius = (dotSize / 2) * scale

        if (glow > 0.01) {
          const glowRadius = radius * 2.5
          const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, glowRadius)
          gradient.addColorStop(0, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.6})`)
          gradient.addColorStop(0.3, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.3})`)
          gradient.addColorStop(0.7, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.1})`)
          gradient.addColorStop(1, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0)`)
          
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
    animationRef.current = requestAnimationFrame(drawDots)
    glowAnimationRef.current = requestAnimationFrame(drawGlow)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (glowAnimationRef.current) cancelAnimationFrame(glowAnimationRef.current)
    }
  }, [drawDots, drawGlow])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      // Debug logging
     
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
     
    }

    // Attach to window to capture all mouse movements
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 overflow-hidden", className)}
    >
      {/* Dot Pattern Layer - z-index: 1 */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ zIndex: dotZIndex }}
      />
      
      {/* Glow Effect Layer - z-index: 2 */}
      <canvas 
        ref={glowCanvasRef} 
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ zIndex: glowZIndex }}
      />

      {/* Vignette overlay - z-index: 3 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 3,
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(10,10,10,0.6) 100%)",
        }}
      />

      {/* Content layer - z-index: 10 */}
      {children && <div className="relative z-10 h-full w-full pointer-events-auto">{children}</div>}
    </div>
  )
}

export default function DotPatternDemo() {
  return <DotPattern />
}
