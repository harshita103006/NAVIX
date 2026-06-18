import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeader, EmptyState } from './primitives'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'

function normalizeQuestions(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return [{ category: 'General', questions: raw.map(String) }]
  }
  if (typeof raw === 'object') {
    return Object.entries(raw).map(([cat, qs]) => ({
      category: cat,
      questions: Array.isArray(qs) ? qs.map(String) : [String(qs)],
    }))
  }
  return []
}

export default function InterviewLab({ questions, mockInterview }) {
  const sections = normalizeQuestions(questions)
  const [active, setActive] = useState(0)

  const hasData = sections.length > 0

  if (!hasData && !mockInterview) {
    return (
      <>
        <SectionHeader index="05" label="Interview Lab" title="Interview Preparation" />
        <EmptyState message="No interview questions returned. Ensure the backend returns interview_questions." />
      </>
    )
  }

  const current = sections[active] || { category: '', questions: [] }

  return (
    <>
      <SectionHeader index="05" label="Interview Lab" title="Interview Preparation" />

      {hasData && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'start' }}>
          {/* category list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sections.map((s, i) => (
              <button
                key={s.category}
                onClick={() => setActive(i)}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: 3,
                  background: active === i ? `rgba(201,168,76,0.12)` : 'transparent',
                  border: `1px solid ${active === i ? 'rgba(201,168,76,0.45)' : 'var(--border)'}`,
                  color: active === i ? CHAMPAGNE : 'var(--muted)',
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {s.category}
                <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 2 }}>
                  {s.questions.length} question{s.questions.length !== 1 ? 's' : ''}
                </div>
              </button>
            ))}
          </div>

          {/* questions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                {current.category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {current.questions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      padding: '14px 0',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: `rgba(201,168,76,0.5)`,
                        fontWeight: 600,
                        minWidth: 20,
                        marginTop: 2,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: 'var(--silver)',
                        lineHeight: 1.65,
                      }}
                    >
                      {q}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* mock interview section */}
      {mockInterview && Object.keys(mockInterview).length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.28em',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Mock Interview
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(mockInterview).map(([key, val], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  padding: '16px 18px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 3,
                }}
              >
                <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {key}
                </div>
                <div style={{ fontSize: 13, color: 'var(--silver)', lineHeight: 1.7 }}>
                  {typeof val === 'string' ? val : JSON.stringify(val)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
