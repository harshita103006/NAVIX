import { motion } from 'framer-motion'
import { SectionHeader, EmptyState, Tag } from './primitives'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'
const COPPER = '#b87333'

function scoreColor(s) {
  if (s >= 75) return GOLD
  if (s >= 50) return '#b8b8c0'
  return COPPER
}

function scoreLabel(s) {
  if (s >= 85) return 'Exceptional'
  if (s >= 75) return 'High Compatibility'
  if (s >= 60) return 'Moderate Fit'
  if (s >= 40) return 'Needs Optimisation'
  return 'Low Compatibility'
}

function ATSRing({ score }) {
  const s = Math.min(100, Math.max(0, Number(score) || 0))
  const r = 70
  const circ = 2 * Math.PI * r
  const dash = (s / 100) * circ
  const color = scoreColor(s)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <svg width={172} height={172} viewBox="0 0 172 172">
        {/* track */}
        <circle cx={86} cy={86} r={r} fill="none" stroke="var(--border)" strokeWidth={10} />
        {/* progress */}
        <motion.circle
          cx={86} cy={86} r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDashoffset={circ / 4}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* score */}
        <text x={86} y={80} textAnchor="middle" fill={CHAMPAGNE} fontSize={36} fontWeight={700} fontFamily="Inter">
          {s}
        </text>
        <text x={86} y={100} textAnchor="middle" fill="var(--muted)" fontSize={11} fontFamily="Inter" letterSpacing="2">
          ATS SCORE
        </text>
      </svg>
      <div style={{ fontSize: 12, color, letterSpacing: '0.12em', textAlign: 'center' }}>
        {scoreLabel(s)}
      </div>
    </div>
  )
}

export default function ATSEngine({ atsScore, topJobs, candidate }) {
  if (atsScore == null) {
    return (
      <>
        <SectionHeader index="01" label="ATS Engine" title="ATS Compatibility Score" />
        <EmptyState message="No ATS score available. Ensure the backend returned ats_score." />
      </>
    )
  }

  return (
    <>
      <SectionHeader index="01" label="ATS Engine" title="ATS Compatibility Score" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 48,
          alignItems: 'start',
          flexWrap: 'wrap',
        }}
      >
        {/* gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ATSRing score={atsScore} />
        </motion.div>

        {/* info panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.25em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
              System Evaluation
            </div>
            <p style={{ fontSize: 14, color: 'var(--silver)', lineHeight: 1.8 }}>
              Your resume has been evaluated against Applicant Tracking System criteria. The score
              reflects keyword density, formatting compatibility, section structure, and role alignment
              against industry benchmarks.
            </p>
          </div>

          {topJobs?.length > 0 && (
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
                Top Matched Positions
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {topJobs.slice(0, 8).map((j, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <Tag accent>{typeof j === 'string' ? j : j.title || j.job || JSON.stringify(j)}</Tag>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* score breakdown indicators */}
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
              Score Interpretation
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { range: '85–100', label: 'Exceptional', color: GOLD },
                { range: '70–84', label: 'Strong', color: GOLD },
                { range: '50–69', label: 'Moderate', color: '#b8b8c0' },
                { range: '0–49', label: 'Weak', color: COPPER },
              ].map((band) => (
                <div
                  key={band.range}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    color: 'var(--muted)',
                  }}
                >
                  <div
                    style={{ width: 8, height: 8, borderRadius: '50%', background: band.color }}
                  />
                  <span style={{ color: band.color }}>{band.range}</span>
                  <span>{band.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
