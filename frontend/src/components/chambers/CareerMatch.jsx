import { motion } from 'framer-motion'
import { SectionHeader, EmptyState } from './primitives'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'

function normalizeRole(r) {
  if (typeof r === 'string') return { title: r, match_score: null, description: null, salary: null }
  return {
    title: r.title || r.role || r.name || JSON.stringify(r),
    match_score: r.match_score ?? r.score ?? null,
    description: r.description || r.summary || null,
    salary: r.salary || r.salary_range || null,
  }
}

export default function CareerMatch({ roles }) {
  if (!roles?.length) {
    return (
      <>
        <SectionHeader index="02" label="Career Match" title="Matched Roles" />
        <EmptyState message="No role data returned. Ensure the backend returns a roles array." />
      </>
    )
  }

  return (
    <>
      <SectionHeader index="02" label="Career Match" title="Matched Roles" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {roles.map((raw, i) => {
          const role = normalizeRole(raw)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.55 }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '20px 20px 18px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.25s',
                cursor: 'default',
              }}
              whileHover={{ borderColor: `rgba(201,168,76,0.5)` }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, ${GOLD}80, transparent)`,
                }}
              />

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: CHAMPAGNE,
                  marginBottom: role.description ? 8 : 12,
                  lineHeight: 1.4,
                }}
              >
                {role.title}
              </div>

              {role.description && (
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                    marginBottom: 12,
                  }}
                >
                  {role.description}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                {role.match_score != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: GOLD,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {Math.round(Number(role.match_score))}%
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      match
                    </div>
                  </div>
                )}
                {role.salary && (
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{role.salary}</div>
                )}
              </div>

              {role.match_score != null && (
                <div style={{ marginTop: 10, height: 2, background: 'var(--border)', borderRadius: 1 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Number(role.match_score))}%` }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      height: '100%',
                      borderRadius: 1,
                      background: `linear-gradient(90deg, ${GOLD}, ${CHAMPAGNE})`,
                    }}
                  />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
