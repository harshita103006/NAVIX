import { motion } from 'framer-motion'
import { SectionHeader, EmptyState } from './primitives'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'

function normalizeResource(r, i) {
  if (typeof r === 'string') return { title: r, provider: null, url: null, type: null, duration: null }
  return {
    title: r.title || r.name || r.course || `Resource ${i + 1}`,
    provider: r.provider || r.platform || r.source || null,
    url: r.url || r.link || null,
    type: r.type || r.format || null,
    duration: r.duration || r.time || null,
  }
}

export default function LearningOrbit({ resources }) {
  if (!resources?.length) {
    return (
      <>
        <SectionHeader index="04" label="Learning Orbit" title="Recommended Resources" />
        <EmptyState message="No learning resources returned. Ensure the backend returns learning_resources." />
      </>
    )
  }

  return (
    <>
      <SectionHeader index="04" label="Learning Orbit" title="Recommended Resources" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {resources.map((raw, i) => {
          const r = normalizeResource(raw, i)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.55 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '16px 18px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                transition: 'border-color 0.25s',
                cursor: r.url ? 'pointer' : 'default',
              }}
              whileHover={{ borderColor: `rgba(201,168,76,0.45)` }}
              onClick={() => r.url && window.open(r.url, '_blank')}
            >
              {/* orbit indicator */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: `1px solid rgba(201,168,76,0.35)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: GOLD,
                    opacity: 0.85,
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: CHAMPAGNE,
                    marginBottom: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {r.title}
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  {r.provider && (
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{r.provider}</div>
                  )}
                  {r.type && (
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: '0.15em',
                        color: 'var(--dim)',
                        textTransform: 'uppercase',
                        padding: '2px 7px',
                        border: '1px solid var(--border)',
                        borderRadius: 2,
                      }}
                    >
                      {r.type}
                    </div>
                  )}
                  {r.duration && (
                    <div style={{ fontSize: 11, color: 'var(--dim)' }}>{r.duration}</div>
                  )}
                </div>
              </div>

              {r.url && (
                <div style={{ fontSize: 11, color: `rgba(201,168,76,0.5)`, flexShrink: 0, marginTop: 3 }}>
                  →
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
