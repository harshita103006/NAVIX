import { motion } from 'framer-motion'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'

export function SectionHeader({ index, label, title }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: '0.32em',
          color: 'var(--muted)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {index && <span style={{ color: 'var(--dim)', marginRight: 8 }}>{index}</span>}
        {label}
      </div>
      <div
        style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 600,
          color: CHAMPAGNE,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </div>
      <div
        style={{
          height: '1px',
          background: `linear-gradient(90deg, ${GOLD}60, transparent)`,
          marginTop: 12,
        }}
      />
    </div>
  )
}

export function EmptyState({ message = 'No data available.' }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--dim)',
        fontSize: 13,
        border: '1px solid var(--border)',
        borderRadius: 4,
        letterSpacing: '0.05em',
      }}
    >
      {message}
    </div>
  )
}

export function GoldBar({ pct, delay = 0, height = 3 }) {
  return (
    <div style={{ height, background: 'var(--border)', borderRadius: 2 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '100%',
          borderRadius: 2,
          background: `linear-gradient(90deg, ${GOLD}, ${CHAMPAGNE})`,
        }}
      />
    </div>
  )
}

export function Tag({ children, accent = false }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        border: `1px solid ${accent ? 'rgba(201,168,76,0.5)' : 'var(--border)'}`,
        borderRadius: 2,
        fontSize: 11,
        color: accent ? CHAMPAGNE : 'var(--silver)',
        background: accent ? 'rgba(201,168,76,0.08)' : 'transparent',
        letterSpacing: '0.04em',
      }}
    >
      {children}
    </span>
  )
}
