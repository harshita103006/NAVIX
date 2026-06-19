import { motion } from 'framer-motion'
import { SectionHeader, EmptyState } from './primitives'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'
const COPPER = '#b87333'

function gapColor(pct) {
  if (pct >= 70) return COPPER
  if (pct >= 40) return '#b8b8c0'
  return GOLD
}

function gapLabel(pct) {
  if (pct >= 70) return 'Critical'
  if (pct >= 40) return 'Moderate'
  return 'Minor'
}

function normalizeSkillGaps(raw) {

  if (raw?.missing_skills && Array.isArray(raw.missing_skills)) {
    return raw.missing_skills.map((item, index) => ({
      skill:
        typeof item === 'object'
          ? item.skill || item.name || `Skill ${index + 1}`
          : item,
      gap: 80 - index * 10,
    }))
  }
  if (!raw || typeof raw !== 'object') return []
  if (Array.isArray(raw)) {
    return raw.map((item) => {
      if (typeof item === 'string') return { skill: item, gap: 50 }
      return {
        skill: item.skill || item.name || item.title || JSON.stringify(item),
        gap: Number(item.gap ?? item.score ?? item.value ?? 50),
      }
    })
  }
  return Object.entries(raw).map(([skill, val]) => ({
    skill,
    gap: Number(val) || 50,
  }))
}

export default function GapMatrix({ skillGaps }) {
  const gaps = normalizeSkillGaps(skillGaps)

  if (!gaps.length) {
    return (
      <>
        <SectionHeader index="03" label="Gap Matrix" title="Skill Gap Analysis" />
        <EmptyState message="No skill gap data returned. Ensure the backend returns skill_gaps." />
      </>
    )
  }

  const maxVal = Math.max(...gaps.map((g) => g.gap), 1)

  return (
    <>
      <SectionHeader index="03" label="Gap Matrix" title="Skill Gap Analysis" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
        {/* bar chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {gaps.map((g, i) => {
            const pct = (g.gap / maxVal) * 100
            const color = gapColor(pct)
            return (
              <motion.div
                key={g.skill}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 5,
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--silver)', fontWeight: 500 }}>
                    {g.skill}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {gapLabel(pct)}
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.07 + 0.2, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    style={{ height: '100%', borderRadius: 2, background: color }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* legend + summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.25em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Gap Classification
            </div>
            {[
              { label: 'Critical', color: COPPER, desc: 'Significant training required' },
              { label: 'Moderate', color: '#b8b8c0', desc: 'Bridgeable with focused effort' },
              { label: 'Minor', color: GOLD, desc: 'Quick to address' },
            ].map((band) => (
              <div
                key={band.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: band.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, color: band.color, fontWeight: 500 }}>{band.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--dim)' }}>{band.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '14px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 3,
              fontSize: 12,
              color: 'var(--muted)',
              lineHeight: 1.7,
            }}
          >
            {gaps.length} skill gap{gaps.length !== 1 ? 's' : ''} identified. Prioritise Critical gaps for
            maximum career velocity.
          </div>
        </motion.div>
      </div>
    </>
  )
}
