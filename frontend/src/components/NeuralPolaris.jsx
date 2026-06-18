import { useEffect, useState } from 'react'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'

export default function NeuralPolaris({ size = 80, animate = true }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!animate) return
    const id = setInterval(() => setTick((t) => t + 1), 50)
    return () => clearInterval(id)
  }, [animate])

  const r = size / 2
  const cx = r
  const cy = r
  const arms = 8
  const outerR = r * 0.88
  const innerR = r * 0.32
  const nodeR = r * 0.065
  const coreR = r * 0.12
  const glowR = r * 0.22

  const pts = Array.from({ length: arms }, (_, i) => {
    const base = (i / arms) * Math.PI * 2 - Math.PI / 2
    const boff = i % 2 !== 0 ? 0.04 * Math.sin(tick * 0.07 + i) : 0
    const dist = i % 2 === 0 ? outerR : outerR * 0.62
    return {
      x: cx + Math.cos(base + boff) * dist,
      y: cy + Math.sin(base + boff) * dist,
      major: i % 2 === 0,
    }
  })

  const orbitR = r * 0.52
  const orbitAngle = tick * 0.04 * (Math.PI / 30)
  const orbitX = cx + Math.cos(orbitAngle) * orbitR
  const orbitY = cy + Math.sin(orbitAngle) * orbitR

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible' }}
      aria-label="NAVIX Neural Polaris Logo"
    >
      <defs>
        <radialGradient id={`coreG_${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CHAMPAGNE} stopOpacity="1" />
          <stop offset="60%" stopColor={GOLD} stopOpacity="0.8" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glowG_${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.3" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* outer halo */}
      <circle cx={cx} cy={cy} r={glowR * 2} fill={`url(#glowG_${size})`} />

      {/* orbit ring */}
      <circle
        cx={cx} cy={cy} r={orbitR}
        fill="none"
        stroke={GOLD}
        strokeWidth="0.5"
        strokeOpacity="0.2"
        strokeDasharray="3 6"
      />

      {/* orbit traveller */}
      <circle cx={orbitX} cy={orbitY} r={nodeR * 0.7} fill={GOLD} opacity="0.75" />

      {/* arm lines */}
      {pts.map((p, i) => (
        <line
          key={i}
          x1={cx} y1={cy} x2={p.x} y2={p.y}
          stroke={p.major ? CHAMPAGNE : GOLD}
          strokeWidth={p.major ? 1.2 : 0.7}
          strokeOpacity={p.major ? 0.85 : 0.45}
        />
      ))}

      {/* arm nodes */}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y}
          r={p.major ? nodeR : nodeR * 0.65}
          fill={p.major ? CHAMPAGNE : GOLD}
          opacity={p.major ? 0.95 : 0.55}
        />
      ))}

      {/* inner ring */}
      <circle
        cx={cx} cy={cy} r={innerR * 2.1}
        fill="none"
        stroke={GOLD}
        strokeWidth="0.6"
        strokeOpacity="0.3"
      />

      {/* core glow */}
      <circle cx={cx} cy={cy} r={glowR} fill={`url(#glowG_${size})`} />

      {/* core */}
      <circle cx={cx} cy={cy} r={coreR} fill={`url(#coreG_${size})`} />
      <circle cx={cx} cy={cy} r={coreR * 0.5} fill={CHAMPAGNE} opacity="0.9" />
    </svg>
  )
}
