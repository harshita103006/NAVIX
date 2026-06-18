import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'
const SILVER = '#b8b8c0'

/* ─────────────────────────────────────────────
   SHARED LIGHT SOURCE
   One physical light origin — the Polaris core,
   horizontally centered in the composition column.
   The beam, the horizon's impact point, and the
   wordmark's base illumination all read their color
   and peak intensity from these same values, so they
   behave as one continuous lighting event instead of
   independently-tuned decorative glows.
───────────────────────────────────────────── */
const LIGHT_CORE_RGB = '255,248,232'   // hottest tone — matches Polaris core / star tip
const LIGHT_EDGE_RGB = '201,168,76'    // GOLD falloff tone
const LIGHT_PEAK = 0.9                 // shared peak intensity (contact point + beam core)

/* ─────────────────────────────────────────────
   STATIC STARFIELD — pure SVG, no canvas.
   Generated once, twinkles via CSS keyframes.
───────────────────────────────────────────── */
function Starfield({ phase, exiting }) {
  const stars = useMemo(() => Array.from({ length: 70 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 0.9 + 0.2,
    op: Math.random() * 0.45 + 0.08,
    dur: 2.5 + Math.random() * 3.5,
    delay: Math.random() * 4,
  })), [])

  return (
    <motion.svg
      width="100%" height="100%"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      viewBox="0 0 100 100" preserveAspectRatio="none"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.6 }}
    >
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.12} fill={CHAMPAGNE}>
          <animate attributeName="opacity" values={`${s.op * 0.3};${s.op};${s.op * 0.3}`} dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </motion.svg>
  )
}

/* ─────────────────────────────────────────────
   NEBULA HAZE — soft radial blooms via CSS only.
   Left/right blobs are now identical mirrored
   values so no residual asymmetric lighting
   remains anywhere in the ambient layer.
───────────────────────────────────────────── */
function NebulaHaze({ phase, exiting }) {
  return (
    <motion.div
      animate={{ opacity: exiting ? 0 : phase >= 1 ? 1 : 0 }}
      transition={{ duration: 1.8 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', top: '-6%', left: '50%', width: '92%', height: '70%',
        transform: 'translateX(-50%)',
        background: `radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 50%, transparent 75%)`,
        filter: 'blur(40px)', animation: 'navixDrift2 34s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '3%', left: '5%', width: '44%', height: '44%',
        background: `radial-gradient(circle, rgba(201,168,76,0.09) 0%, rgba(201,168,76,0.028) 45%, transparent 72%)`,
        filter: 'blur(30px)', animation: 'navixDrift1 22s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '3%', right: '5%', width: '44%', height: '44%',
        background: `radial-gradient(circle, rgba(201,168,76,0.09) 0%, rgba(201,168,76,0.028) 45%, transparent 72%)`,
        filter: 'blur(30px)', animation: 'navixDrift2 26s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '22%', width: '52%', height: '40%',
        background: `radial-gradient(circle, rgba(201,168,76,0.11) 0%, rgba(201,168,76,0.03) 45%, transparent 72%)`,
        filter: 'blur(32px)', animation: 'navixDrift1 30s ease-in-out infinite reverse',
      }} />
      <style>{`
        @keyframes navixDrift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(2%,-1.5%) scale(1.08); } }
        @keyframes navixDrift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-2%,1.5%) scale(1.05); } }
      `}</style>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   HORIZON ARC
   A true illuminated planetary limb beneath the
   Polaris, not a decorative glow streak.

   Centering fix: the SVG now carries its own
   left:50% + translateX(-50%), so it self-centers
   on its own width. Previously it relied on a
   wrapper div whose width collapsed to ~0 (its
   only child was also absolutely positioned),
   which anchored the SVG's LEFT EDGE — not its
   center — to the compass's horizontal center.
   That is what produced the right-shifted horizon.

   Symmetry guarantee: every coordinate is written
   as cx ± an identical offset (cx = width / 2), and
   cx is now also the SVG's true visual center, so
   the limb is symmetric both in its own geometry
   AND in its placement under the compass.

   Lighting logic: the "contact point" — where the
   beam from the compass core lands — is now
   centered at apexY, the curve's actual visual
   peak (a quadratic bezier's peak is at
   baseline - limbDepth/2, not at its control point
   baseline - limbDepth). Previously the contact
   ellipse sat at the control point, which floated
   visibly above the limb instead of sitting on it.
   Color/intensity now reference the shared
   LIGHT_CORE_RGB / LIGHT_PEAK constants.
───────────────────────────────────────────── */
function HorizonArc({ phase, exiting, width }) {
  const h = width * 0.24
  const cx = width / 2
  const limbHalfSpan = width * 0.42
  const limbDepth = h * 0.36
  const baseline = h * 0.50
  const apexY = baseline - limbDepth / 2 // true visual peak of the quadratic curve below

  const limbPath = `M ${cx - limbHalfSpan} ${baseline} Q ${cx} ${baseline - limbDepth} ${cx + limbHalfSpan} ${baseline}`
  const limbPathInner = `M ${cx - limbHalfSpan * 0.82} ${baseline * 0.96} Q ${cx} ${baseline - limbDepth * 0.94} ${cx + limbHalfSpan * 0.82} ${baseline * 0.96}`

  return (
    <motion.svg
      width={width} height={h} viewBox={`0 0 ${width} ${h}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : phase >= 1 ? 1 : 0 }}
      transition={{ duration: 1.5, delay: 0.45 }}
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <radialGradient id="horizonContact" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`rgb(${LIGHT_CORE_RGB})`} stopOpacity={LIGHT_PEAK} />
          <stop offset="45%" stopColor={GOLD} stopOpacity="0.40" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="horizonHalo" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.20" />
          <stop offset="55%" stopColor={GOLD} stopOpacity="0.07" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="horizonLimbGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0" />
          <stop offset="50%" stopColor={`rgb(${LIGHT_CORE_RGB})`} stopOpacity="0.92" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>
        <filter id="horizonGlowEdge" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={h * 0.05} />
        </filter>
        <filter id="horizonGlowSoft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={h * 0.12} />
        </filter>
      </defs>

      {/* halo — symmetric, centered on cx AND on the curve's true apex */}
      <ellipse cx={cx} cy={apexY} rx={limbHalfSpan * 0.85} ry={h * 0.30} fill="url(#horizonHalo)" filter="url(#horizonGlowSoft)" />

      {/* the limb itself — one continuous mirrored curve, three passes for depth */}
      <path d={limbPath} fill="none" stroke="url(#horizonLimbGrad)" strokeWidth={h * 0.14} filter="url(#horizonGlowSoft)" opacity="0.55" />
      <path d={limbPath} fill="none" stroke="url(#horizonLimbGrad)" strokeWidth={h * 0.045} filter="url(#horizonGlowEdge)" />
      <path d={limbPath} fill="none" stroke="url(#horizonLimbGrad)" strokeWidth="1.1" />
      <path d={limbPathInner} fill="none" stroke={GOLD} strokeOpacity="0.20" strokeWidth="0.7" />

      {/* contact point — sits ON the curve's real peak, where the beam lands */}
      <ellipse cx={cx} cy={apexY} rx={width * 0.05} ry={h * 0.12} fill="url(#horizonContact)" filter="url(#horizonGlowEdge)" />
    </motion.svg>
  )
}

/* ─────────────────────────────────────────────
   NEURAL POLARIS — the unified hero instrument.
   One long radiant spike + minor points,
   counter-rotating rings, orbiting nodes,
   data particles, breathing pulse waves.
   All SVG, animated via tick state (cheap RAF).
───────────────────────────────────────────── */
function NeuralPolaris({ phase, mx, my, size, exiting }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let raf
    const loop = () => { setTick(t => t + 1); raf = requestAnimationFrame(loop) }
    const id = setInterval(() => setTick(t => t + 1), 45)
    return () => clearInterval(id)
  }, [])

  const t = tick * 0.026
  const r = size / 2, cx = r, cy = r

  const p1x = (mx || 0) * 11, p1y = (my || 0) * 11
  const p2x = (mx || 0) * 5.5, p2y = (my || 0) * 5.5
  const p3x = (mx || 0) * 2.2, p3y = (my || 0) * 2.2

  // Dominant north spike + grounding south point
  const northLen = r * 0.92, northBreathe = r * 0.005 * Math.sin(t * 1.3), northWaist = r * 0.050
  const northTip = { x: cx, y: cy - northLen - northBreathe }
  const northL = { x: cx - northWaist, y: cy - northLen * 0.30 }
  const northR = { x: cx + northWaist, y: cy - northLen * 0.30 }
  const southLen = r * 0.38
  const southTip = { x: cx, y: cy + southLen }
  const southL = { x: cx - northWaist * 0.78, y: cy + southLen * 0.30 }
  const southR = { x: cx + northWaist * 0.78, y: cy + southLen * 0.30 }

  // 7 minor arms
  const minorArms = Array.from({ length: 7 }, (_, i) => {
    const angle = -Math.PI / 2 + ((i + 1) / 8) * Math.PI * 2
    const major = i % 2 === 1
    const tip = major ? r * 0.48 : r * 0.29
    const waist = major ? r * 0.038 : r * 0.025
    const perp = angle + Math.PI / 2
    return {
      major,
      tip: { x: cx + Math.cos(angle) * tip, y: cy + Math.sin(angle) * tip },
      l: { x: cx + Math.cos(perp) * waist + Math.cos(angle) * tip * 0.28, y: cy + Math.sin(perp) * waist + Math.sin(angle) * tip * 0.28 },
      rr: { x: cx - Math.cos(perp) * waist + Math.cos(angle) * tip * 0.28, y: cy - Math.sin(perp) * waist + Math.sin(angle) * tip * 0.28 },
    }
  })

  // Compass bezel ticks
  const cR = r * 0.70
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2 - Math.PI / 2
    const card = i % 9 === 0, prim = i % 3 === 0
    const inner = cR * (card ? 0.89 : prim ? 0.93 : 0.965)
    return { x1: cx + Math.cos(a) * inner, y1: cy + Math.sin(a) * inner, x2: cx + Math.cos(a) * cR, y2: cy + Math.sin(a) * cR, card, prim }
  })

  // Two counter-rotating micro-rings (watch movement)
  const ringOuterR = r * 0.615, ringInnerR = r * 0.485
  const rotOuter = t * 1.7, rotInner = -t * 2.6
  const ringOuterDots = Array.from({ length: 20 }, (_, i) => {
    const a = (i / 20) * Math.PI * 2 + rotOuter
    return { x: cx + Math.cos(a) * ringOuterR, y: cy + Math.sin(a) * ringOuterR, maj: i % 5 === 0 }
  })
  const ringInnerDots = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + rotInner
    return { x: cx + Math.cos(a) * ringInnerR, y: cy + Math.sin(a) * ringInnerR }
  })

  // Orbiting intelligence nodes — constellation
  const orbitingNodes = [
    { a: 0.2, rad: ringOuterR, rot: rotOuter }, { a: 0.9, rad: ringOuterR, rot: rotOuter },
    { a: 1.7, rad: ringOuterR, rot: rotOuter }, { a: 2.4, rad: ringOuterR, rot: rotOuter },
    { a: 3.1, rad: ringOuterR, rot: rotOuter },
    { a: 0.5, rad: ringInnerR, rot: rotInner }, { a: 1.4, rad: ringInnerR, rot: rotInner },
    { a: 2.3, rad: ringInnerR, rot: rotInner },
  ].map((n, i) => {
    const ang = n.a + n.rot
    const pulse = 0.7 + 0.3 * Math.sin(t * 1.2 + i * 0.75)
    return { x: cx + Math.cos(ang) * n.rad, y: cy + Math.sin(ang) * n.rad, pulse, r: (1.5 + (i % 3) * 0.4) * pulse }
  })

  // Fast tiny data particles — small dots tracing thin orbits
  const dataParticles = [
    { radius: r * 0.385, speed: 0.55, size: 1.5, op: 0.6 },
    { radius: r * 0.555, speed: -0.42, size: 1.1, op: 0.42 },
    { radius: r * 0.66, speed: 0.30, size: 0.9, op: 0.30 },
  ].map(d => ({
    ...d,
    x: cx + Math.cos(t * d.speed) * d.radius,
    y: cy + Math.sin(t * d.speed) * d.radius,
  }))

  // Pulse waves — expanding rings from core, looped
  const waveCycle = (t * 0.55) % 1.6
  const wave1R = r * 0.08 + waveCycle * r * 0.55
  const wave1Op = Math.max(0, 0.35 * (1 - waveCycle / 1.6))
  const waveCycle2 = ((t * 0.55) + 0.8) % 1.6
  const wave2R = r * 0.08 + waveCycle2 * r * 0.55
  const wave2Op = Math.max(0, 0.35 * (1 - waveCycle2 / 1.6))

  const coreR = r * 0.044, glowR = r * 0.10

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.08 }}
      animate={{ opacity: exiting ? 0 : phase >= 1 ? 1 : 0, scale: exiting ? 2.3 : 1 }}
      transition={exiting
        ? { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
        : { opacity: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }, scale: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
      }
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
    >
      {/* LAYER 1 — bezel, deep haze, slowest parallax */}
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${p3x}px,${p3y}px)`, transition: 'transform 0.22s ease-out' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible', position: 'absolute', inset: 0 }}>
          <defs>
            <radialGradient id="navixDeepHaze" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.10" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.05} fill="url(#navixDeepHaze)" />
          <circle cx={cx} cy={cy} r={cR * 1.015} fill="none" stroke={GOLD} strokeWidth={0.65} strokeOpacity={0.46} />
          <circle cx={cx} cy={cy} r={cR * 0.985} fill="none" stroke={GOLD} strokeWidth={0.4} strokeOpacity={0.22} />
          {ticks.map((tk, i) => (
            <line key={i} x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2} stroke={GOLD}
              strokeWidth={tk.card ? 1.2 : tk.prim ? 0.7 : 0.42}
              strokeOpacity={tk.card ? 0.85 : tk.prim ? 0.55 : 0.26} />
          ))}
        </svg>
      </div>

      {/* LAYER 2 — counter-rotating rings, orbiting nodes, data particles */}
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${p2x}px,${p2y}px)`, transition: 'transform 0.16s ease-out' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible', position: 'absolute', inset: 0 }}>
          <defs><filter id="navixSoftBlur"><feGaussianBlur stdDeviation="1.4" /></filter></defs>

          {/* outer rotating micro-ring */}
          <circle cx={cx} cy={cy} r={ringOuterR} fill="none" stroke={GOLD} strokeWidth={0.55} strokeOpacity={0.48} />
          {ringOuterDots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.maj ? 1.5 : 0.75} fill={GOLD} opacity={d.maj ? 0.72 : 0.32} />)}

          {/* inner counter-rotating micro-ring */}
          <circle cx={cx} cy={cy} r={ringInnerR} fill="none" stroke={GOLD} strokeWidth={0.45} strokeOpacity={0.36} />
          {ringInnerDots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={0.7} fill={GOLD} opacity={0.34} />)}

          {/* constellation connections between orbiting nodes */}
          {orbitingNodes.map((n, i) => {
            const n2 = orbitingNodes[(i + 3) % orbitingNodes.length]
            return <line key={i} x1={n.x} y1={n.y} x2={n2.x} y2={n2.y} stroke={GOLD} strokeWidth={0.28} strokeOpacity={0.10} />
          })}
          {/* orbiting intelligence nodes */}
          {orbitingNodes.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={n.r * 2.1} fill={GOLD} opacity={0.13} filter="url(#navixSoftBlur)" />
              <circle cx={n.x} cy={n.y} r={n.r} fill={CHAMPAGNE} opacity={0.76 * n.pulse} />
            </g>
          ))}

          {/* fast tiny data particles */}
          {dataParticles.map((d, i) => (
            <g key={i}>
              <circle cx={d.x} cy={d.y} r={d.size * 1.8} fill={GOLD} opacity={d.op * 0.2} filter="url(#navixSoftBlur)" />
              <circle cx={d.x} cy={d.y} r={d.size} fill={GOLD} opacity={d.op} />
            </g>
          ))}
        </svg>
      </div>

      {/* LAYER 3 — star body, pulse waves, core */}
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${p1x}px,${p1y}px)`, transition: 'transform 0.08s ease-out' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible', position: 'absolute', inset: 0 }}>
          <defs>
            <radialGradient id="navixCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff8e8" />
              <stop offset="30%" stopColor={CHAMPAGNE} />
              <stop offset="65%" stopColor={GOLD} stopOpacity="0.7" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="navixHaloGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.40" />
              <stop offset="50%" stopColor={GOLD} stopOpacity="0.08" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="navixNorthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff8e8" stopOpacity="0.95" />
              <stop offset="40%" stopColor={CHAMPAGNE} stopOpacity="0.85" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.55" />
            </linearGradient>
            <filter id="navixGlowBig" x="-160%" y="-160%" width="420%" height="420%"><feGaussianBlur stdDeviation="11" /></filter>
            <filter id="navixGlowSmall" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.2" /></filter>
          </defs>

          {/* pulse waves — expanding rings of intelligence */}
          <circle cx={cx} cy={cy} r={wave1R} fill="none" stroke={GOLD} strokeWidth={0.6} strokeOpacity={wave1Op} />
          <circle cx={cx} cy={cy} r={wave2R} fill="none" stroke={GOLD} strokeWidth={0.6} strokeOpacity={wave2Op} />

          {/* North spike — dominant radiant point */}
          <path d={`M ${cx} ${cy} L ${northL.x} ${northL.y} L ${northTip.x} ${northTip.y} L ${northR.x} ${northR.y} Z`}
            fill="url(#navixNorthGrad)" opacity="0.55" filter="url(#navixGlowBig)" />
          <path d={`M ${cx} ${cy} L ${northL.x} ${northL.y} L ${northTip.x} ${northTip.y} L ${northR.x} ${northR.y} Z`}
            fill="url(#navixNorthGrad)" opacity="0.95" />
          <line x1={cx} y1={cy} x2={northTip.x} y2={northTip.y} stroke="#fff8e8" strokeWidth="0.55" strokeOpacity="0.55" />

          {/* South counter-point */}
          <path d={`M ${cx} ${cy} L ${southL.x} ${southL.y} L ${southTip.x} ${southTip.y} L ${southR.x} ${southR.y} Z`}
            fill={GOLD} opacity="0.18" filter="url(#navixGlowBig)" />
          <path d={`M ${cx} ${cy} L ${southL.x} ${southL.y} L ${southTip.x} ${southTip.y} L ${southR.x} ${southR.y} Z`}
            fill={GOLD} opacity="0.58" />

          {/* 7 minor arms */}
          {minorArms.map((arm, i) => {
            const d = `M ${cx} ${cy} L ${arm.l.x} ${arm.l.y} L ${arm.tip.x} ${arm.tip.y} L ${arm.rr.x} ${arm.rr.y} Z`
            return (
              <g key={i}>
                <path d={d} fill={arm.major ? CHAMPAGNE : GOLD} opacity={arm.major ? 0.16 : 0.10} filter="url(#navixGlowSmall)" />
                <path d={d} fill={arm.major ? CHAMPAGNE : GOLD} opacity={arm.major ? 0.78 : 0.48} />
              </g>
            )
          })}

          {/* outer breathing corona — extra radiant spread */}
          <circle cx={cx} cy={cy} r={r * 0.62 + r * 0.02 * Math.sin(t * 0.8)} fill="none" stroke={GOLD} strokeWidth={0.5} strokeOpacity={0.07 + 0.05 * Math.sin(t * 0.8)} filter="url(#navixGlowSmall)" />

          {/* breathing dual aura */}
          <circle cx={cx} cy={cy} r={r * 0.150 + r * 0.020 * Math.sin(t * 2.0)} fill="none" stroke={GOLD} strokeWidth={0.5} strokeOpacity={0.34} strokeDasharray="6 14" />
          <circle cx={cx} cy={cy} r={r * 0.112 + r * 0.014 * Math.sin(t * 2.0 + Math.PI)} fill="none" stroke={GOLD} strokeWidth={0.35} strokeOpacity={0.22} />

          {/* core halo + solid core */}
          <circle cx={cx} cy={cy} r={glowR * 6.4} fill="url(#navixHaloGrad)" opacity="0.72" filter="url(#navixGlowBig)" />
          <circle cx={cx} cy={cy} r={glowR * 3.6} fill="url(#navixHaloGrad)" />
          <circle cx={cx} cy={cy} r={glowR * 1.3} fill="url(#navixHaloGrad)" filter="url(#navixGlowSmall)" />
          <circle cx={cx} cy={cy} r={coreR * 1.15} fill="url(#navixCoreGrad)" />
          <circle cx={cx} cy={cy} r={coreR * 0.46} fill="#fff8e8" opacity="0.98" />
        </svg>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   LIGHT SPIRE — BEAM.
   Unifies Polaris + horizon + NAVIX into one
   continuous lighting event. All original
   animations (traveling pulse, drifting
   particles) are preserved unchanged. The static
   connective column beneath them has had its
   opacity raised and its bottom stop given a
   small residual brightness (instead of fading to
   fully transparent) so the beam visibly carries
   through to the horizon/wordmark rather than
   dying out before it gets there. Colors now
   reference the shared LIGHT_CORE_RGB constant.
───────────────────────────────────────────── */
function LightSpire({ phase, exiting, height }) {
  const [tick, setTick] = useState(0)
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 45); return () => clearInterval(id) }, [])
  const t = tick * 0.05

  const particles = [
    { speed: 1.0, phaseOff: 0.0, size: 1.4, op: 0.75 },
    { speed: 0.7, phaseOff: 2.1, size: 1.0, op: 0.5 },
    { speed: 1.35, phaseOff: 4.4, size: 0.8, op: 0.4 },
  ].map(p => ({ ...p, pos: ((t * p.speed + p.phaseOff) % 4) / 4 }))

  const pulseCycle = (t * 0.4) % 1
  const pulseY1 = height * Math.max(0, pulseCycle * 1.3 - 0.15)
  const pulseY2 = height * Math.min(1, pulseCycle * 1.3 + 0.06)
  const pulseOp = pulseCycle < 0.78 ? 0.6 * (1 - pulseCycle / 0.78) + 0.15 : 0

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: exiting ? 0 : phase >= 1 ? 1 : 0, scaleY: phase >= 1 ? 1 : 0 }}
      transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: 3, height, position: 'relative', flexShrink: 0, transformOrigin: 'top' }}
    >
      <svg width={3} height={height} viewBox={`0 0 3 ${height}`} style={{ overflow: 'visible', position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="navixSpireGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgb(${LIGHT_CORE_RGB})`} stopOpacity="0.92" />
            <stop offset="30%" stopColor={GOLD} stopOpacity="0.62" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0.26" />
          </linearGradient>
          <linearGradient id="navixSpireColumnGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.32" />
            <stop offset="55%" stopColor={GOLD} stopOpacity="0.16" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0.06" />
          </linearGradient>
          <filter id="navixSpireGlow" x="-400%" y="-5%" width="900%" height="110%"><feGaussianBlur stdDeviation="2.6" /></filter>
          <filter id="navixSpireColumnGlow" x="-1400%" y="-90%" width="2900%" height="280%"><feGaussianBlur stdDeviation="12" /></filter>
        </defs>
        {/* continuous soft column — the unifying light connecting compass, horizon and wordmark */}
        <line x1={1.5} y1={0} x2={1.5} y2={height} stroke="url(#navixSpireColumnGrad)" strokeWidth={20} filter="url(#navixSpireColumnGlow)" />
        <line x1={1.5} y1={0} x2={1.5} y2={height} stroke={GOLD} strokeWidth={8} strokeOpacity={0.20} filter="url(#navixSpireGlow)" />
        <line x1={1.5} y1={0} x2={1.5} y2={height} stroke="url(#navixSpireGrad)" strokeWidth={1.1} />
        {/* descending signal pulse — a bright segment travelling the beam */}
        <line x1={1.5} y1={pulseY1} x2={1.5} y2={pulseY2} stroke={`rgb(${LIGHT_CORE_RGB})`} strokeWidth={1.6} strokeOpacity={pulseOp} filter="url(#navixSpireGlow)" />
        {/* drifting particles tracing the connection */}
        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={1.5} cy={p.pos * height} r={p.size * 2.4} fill={GOLD} opacity={p.op * 0.22} filter="url(#navixSpireGlow)" />
            <circle cx={1.5} cy={p.pos * height} r={p.size} fill={`rgb(${LIGHT_CORE_RGB})`} opacity={p.op} />
          </g>
        ))}
      </svg>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   WORDMARK
   Added a base illumination glow anchored to the
   bottom of the wordmark, using the same
   LIGHT_CORE_RGB / LIGHT_EDGE_RGB values as the
   horizon contact point and beam core, so NAVIX
   reads as lit by the same light source rather
   than carrying its own independent gold glow.
   Typography, shine animation, and tagline are
   unchanged.
───────────────────────────────────────────── */
function Wordmark({ phase, exiting }) {
  return (
    <motion.div
      animate={{ opacity: exiting ? 0 : 1, y: exiting ? 8 : 0 }}
      transition={{ duration: 0.4 }}
      style={{ textAlign: 'center', position: 'relative' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : phase >= 2 ? [0.7, 1, 0.7] : 0 }}
        transition={{ opacity: phase >= 2 && !exiting ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 } : { duration: 1.4, delay: 0.3 } }}
        style={{
          position: 'absolute', left: '50%', top: '50%', width: '120%', height: '220%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse 60% 70% at 50% 50%, rgba(${LIGHT_EDGE_RGB},0.22) 0%, rgba(${LIGHT_EDGE_RGB},0.07) 45%, transparent 75%)`,
          filter: 'blur(22px)', pointerEvents: 'none', zIndex: -1,
        }}
      />
      {/* base illumination — ties the wordmark into the shared light source
          (horizon contact point / beam core) instead of its own isolated glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : phase >= 2 ? 1 : 0 }}
        transition={{ duration: 1.6, delay: 0.55 }}
        style={{
          position: 'absolute', left: '50%', bottom: '-6%', width: '64%', height: '60%',
          transform: 'translateX(-50%)',
          background: `radial-gradient(ellipse 60% 90% at 50% 100%, rgba(${LIGHT_CORE_RGB},0.28) 0%, rgba(${LIGHT_EDGE_RGB},0.14) 45%, transparent 78%)`,
          filter: 'blur(20px)', pointerEvents: 'none', zIndex: -1,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.02em' }}>
        {['N', 'A', 'V', 'I', 'X'].map((l, i) => (
          <motion.span key={l}
            initial={{ opacity: 0, y: 12, filter: 'blur(9px)' }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 12, filter: phase >= 2 ? 'blur(0px)' : 'blur(9px)' }}
            transition={{ delay: 0.06 + i * 0.055, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(44px, 7.2vw, 78px)',
              fontWeight: 700,
              letterSpacing: '0.19em',
              lineHeight: 1,
              display: 'inline-block',
              backgroundImage: `linear-gradient(115deg, transparent 0%, transparent 30%, rgba(255,250,240,0.95) 46%, transparent 62%, transparent 100%), linear-gradient(180deg, #fffaf0 0%, #fdf3d8 28%, ${CHAMPAGNE} 55%, ${GOLD} 100%)`,
              backgroundSize: '300% 300%, 100% 100%',
              backgroundPosition: '0% 0%, 0% 0%',
              animation: phase >= 2 ? 'navixShine 5.5s linear infinite' : 'none',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 16px rgba(255,248,232,0.65)) drop-shadow(0 0 42px rgba(201,168,76,0.62)) drop-shadow(0 0 86px rgba(201,168,76,0.34))`,
            }}
          >{l}</motion.span>
        ))}
      </div>
      <style>{`
        @keyframes navixShine {
          0% { background-position: -80% -80%, 0% 0%; }
          100% { background-position: 80% 80%, 0% 0%; }
        }
      `}</style>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.85, delay: 0.40, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: 'clamp(8px,1.5vh,14px) 0' }}
      >
        <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
        <span style={{ width: 3.5, height: 3.5, transform: 'rotate(45deg)', background: GOLD, opacity: 0.8, flexShrink: 0 }} />
        <span style={{ fontSize: 'clamp(9px,1.1vw,11px)', letterSpacing: '0.28em', color: SILVER, fontWeight: 400, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Navigate Your Career with Intelligence
        </span>
        <span style={{ width: 3.5, height: 3.5, transform: 'rotate(45deg)', background: GOLD, opacity: 0.8, flexShrink: 0 }} />
        <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   ENTER NAVIX — luxury CTA
───────────────────────────────────────────── */
function EnterButton({ onClick, exiting }) {
  const [hov, setHov] = useState(false)
  const ref = useRef()
  const mx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 })
  const my = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 })

  const onMM = (e) => {
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (rect.left + rect.width / 2)) / rect.width * 8)
    my.set((e.clientY - (rect.top + rect.height / 2)) / rect.height * 4)
  }
  const onLeave = () => { setHov(false); mx.set(0); my.set(0) }

  return (
    <motion.div style={{ x: mx, y: my, opacity: exiting ? 0 : 1, position: 'relative' }} transition={{ opacity: { duration: 0.3 } }}>
      <motion.div
        animate={{ opacity: hov ? 0 : [0.35, 0.7, 0.35], scale: hov ? 1 : [1, 1.08, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: '-30%', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.20) 0%, rgba(201,168,76,0.06) 50%, transparent 75%)',
          filter: 'blur(18px)', pointerEvents: 'none', zIndex: -1,
        }}
      />
      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={onLeave}
        onMouseMove={onMM}
        animate={{ scale: hov ? 1.035 : 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'relative',
          padding: 'clamp(10px,1.6vh,15px) clamp(34px,5vw,50px)',
          border: `1px solid rgba(201,168,76,${hov ? 0.95 : 0.55})`,
          borderRadius: 3,
          background: hov
            ? 'linear-gradient(180deg, rgba(201,168,76,0.12), rgba(201,168,76,0.05))'
            : 'linear-gradient(180deg, rgba(201,168,76,0.05), rgba(201,168,76,0.015))',
          color: hov ? '#fff8e8' : CHAMPAGNE,
          fontSize: 'clamp(10px,1.1vw,12px)',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
          overflow: 'hidden',
          fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
          transition: 'border-color 0.3s, color 0.3s, background 0.3s',
          boxShadow: hov
            ? '0 0 42px rgba(201,168,76,0.30), 0 0 80px rgba(201,168,76,0.12), inset 0 0 22px rgba(201,168,76,0.10)'
            : '0 0 22px rgba(201,168,76,0.14), inset 0 0 10px rgba(201,168,76,0.04)',
        }}
      >
        {/* glass reflection strip */}
        <span style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '46%',
          background: hov
            ? 'linear-gradient(180deg, rgba(255,250,240,0.16) 0%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(255,250,240,0.08) 0%, transparent 100%)',
          pointerEvents: 'none', transition: 'background 0.3s',
        }} />
        <span style={{ position: 'absolute', top: -1, left: -1, width: 9, height: 9, borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}`, opacity: hov ? 1 : 0.5, transition: 'opacity 0.3s' }} />
        <span style={{ position: 'absolute', top: -1, right: -1, width: 9, height: 9, borderTop: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}`, opacity: hov ? 1 : 0.5, transition: 'opacity 0.3s' }} />
        <span style={{ position: 'absolute', bottom: -1, left: -1, width: 9, height: 9, borderBottom: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}`, opacity: hov ? 1 : 0.5, transition: 'opacity 0.3s' }} />
        <span style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}`, opacity: hov ? 1 : 0.5, transition: 'opacity 0.3s' }} />
        <motion.span
          initial={{ x: '-130%' }} animate={{ x: '130%' }}
          transition={{ duration: hov ? 0.6 : 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: hov ? 1.2 : 2.6 }}
          style={{
            position: 'absolute', inset: 0,
            background: hov
              ? 'linear-gradient(90deg, transparent, rgba(201,168,76,0.22), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent)',
            pointerEvents: 'none', display: 'block',
          }}
        />
        <span>Enter NAVIX</span>
        <motion.span animate={{ x: hov ? 4 : 0 }} transition={{ duration: 0.25 }} style={{ fontSize: 14, color: hov ? CHAMPAGNE : GOLD, lineHeight: 1 }}>→</motion.span>
      </motion.button>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   CORNER BRACKETS
───────────────────────────────────────────── */
function CornerBrackets({ phase, exiting }) {
  const defs = [
    { top: '24px', left: '24px', borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` },
    { top: '24px', right: '24px', borderTop: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` },
    { bottom: '24px', left: '24px', borderBottom: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` },
    { bottom: '24px', right: '24px', borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` },
  ]
  return defs.map((s, i) => (
    <motion.div key={i}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: exiting ? 0 : phase >= 1 ? 0.42 : 0, scale: phase >= 1 ? 1 : 0.5 }}
      transition={{ delay: exiting ? 0 : i * 0.08 + 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', width: 20, height: 20, ...s }}
    />
  ))
}

/* ─────────────────────────────────────────────
   MAIN INTRO SCREEN — strict 100vh, no overflow.
   Sizes derive from viewport height via clamp().
───────────────────────────────────────────── */
export default function IntroScreen({ onEnter }) {
  const [phase, setPhase] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [rm, setRm] = useState({ x: 0, y: 0 })
  const mxV = useMotionValue(0), myV = useMotionValue(0)
  const containerRef = useRef()
  const [polarisSize, setPolarisSize] = useState(220)

  // Compute Polaris size from available viewport so the whole
  // composition always fits within 100vh without scrolling.
  useEffect(() => {
    const calc = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      // Reserve space for spire + wordmark + tagline + quote + button + paddings
      const reserved = Math.min(vh * 0.50, 360)
      const available = vh - reserved
      const byHeight = Math.max(150, Math.min(available, vh * 0.46))
      const byWidth = vw * 0.42
      setPolarisSize(Math.max(150, Math.min(byHeight, byWidth, 420)))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    const ts = [[1, 140], [2, 950], [3, 2200], [4, 2950]]
    const timers = ts.map(([p, ms]) => setTimeout(() => setPhase(p), ms))
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    let raf, t = 0
    const drift = () => {
      t += 0.007
      const nx = Math.sin(t * 0.60) * 0.026, ny = Math.cos(t * 0.44) * 0.020
      mxV.set(nx); myV.set(ny); setRm({ x: nx, y: ny })
      raf = requestAnimationFrame(drift)
    }
    drift(); return () => cancelAnimationFrame(raf)
  }, [])

  const handleMM = useCallback((e) => {
    if (exiting) return
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    mxV.set(nx); myV.set(ny); setRm({ x: nx, y: ny })
  }, [exiting])

  const handleEnter = useCallback(() => {
    setExiting(true)
    setTimeout(() => onEnter(), 800)
  }, [onEnter])

  const spireHeight = Math.max(20, polarisSize * 0.14)

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMM}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 120% 90% at 50% 30%, #0d0d0f 0%, #080808 55%, #050505 100%)',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Cosmic atmosphere — SVG starfield + CSS nebula, no canvas */}
      <Starfield phase={phase} exiting={exiting} />
      <NebulaHaze phase={phase} exiting={exiting} />

      {/* Volumetric central column */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: '50%', width: 'min(480px, 66vw)',
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse 100% 62% at 50% 38%, rgba(201,168,76,0.13) 0%, rgba(201,168,76,0.04) 55%, transparent 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Mid vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 75% at 50% 42%, transparent 30%, rgba(8,8,8,0.80) 100%)', pointerEvents: 'none', zIndex: 1 }} />
      {/* Perimeter crush */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 98% 94% at 50% 50%, transparent 46%, rgba(2,2,2,0.86) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Exit gold pulse */}
      <AnimatePresence>
        {exiting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.08, 0] }} transition={{ duration: 0.6, times: [0, 0.28, 1] }}
            style={{ position: 'absolute', inset: 0, background: GOLD, pointerEvents: 'none', zIndex: 10 }} />
        )}
      </AnimatePresence>

      <CornerBrackets phase={phase} exiting={exiting} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 && !exiting ? 0.55 : 0 }} transition={{ delay: 0.45 }}
        style={{ position: 'absolute', top: 26, left: 30, zIndex: 3, fontSize: 9, letterSpacing: '0.26em', color: GOLD, textTransform: 'uppercase', fontWeight: 500 }}>
        Career Intelligence OS
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 && !exiting ? 0.42 : 0 }} transition={{ delay: 0.55 }}
        style={{ position: 'absolute', top: 26, right: 30, zIndex: 3, fontSize: 9, letterSpacing: '0.2em', color: SILVER, textTransform: 'uppercase' }}>
        Neural Polaris Engine
      </motion.div>

      {/* ── Unified vertical composition — compass / beam / wordmark as one system ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 0,
        maxHeight: '92vh',
        justifyContent: 'center',
      }}>

        {/* Polaris with horizon arc beneath */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <NeuralPolaris phase={phase} mx={rm.x} my={rm.y} size={polarisSize} exiting={exiting} />
          <div style={{ position: 'absolute', left: '50%', bottom: polarisSize * 0.01, transform: 'translateX(-50%)', zIndex: -1 }}>
            <HorizonArc phase={phase} exiting={exiting} width={polarisSize * 1.25} />
          </div>
        </div>

        {/* Light spire — unifying connective beam */}
        <LightSpire phase={phase} exiting={exiting} height={spireHeight} />

        {/* Wordmark */}
        <Wordmark phase={phase} exiting={exiting} />

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: phase >= 3 && !exiting ? 1 : 0, y: phase >= 3 ? 0 : 6 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: 'clamp(4px,1vh,10px)', textAlign: 'center' }}
        >
          <div style={{ fontSize: 'clamp(11px,1.2vw,13px)', color: 'rgba(184,184,192,0.72)', letterSpacing: '0.02em', fontWeight: 300, fontStyle: 'italic' }}>
            "Your resume is a record.&nbsp;&nbsp;Your future is a system."
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 14, filter: phase >= 4 ? 'blur(0px)' : 'blur(4px)' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: 'clamp(18px,3.2vh,32px)' }}
        >
          <EnterButton onClick={handleEnter} exiting={exiting} />
        </motion.div>

      </div>
    </div>
  )
}