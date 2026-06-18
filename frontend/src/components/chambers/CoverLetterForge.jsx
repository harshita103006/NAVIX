import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, EmptyState } from './primitives'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'

export default function CoverLetterForge({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!text) {
    return (
      <>
        <SectionHeader index="06" label="Cover Letter Forge" title="Generated Cover Letter" />
        <EmptyState message="No cover letter returned. Ensure the backend returns cover_letter." />
      </>
    )
  }

  const paragraphs = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  return (
    <>
      <SectionHeader index="06" label="Cover Letter Forge" title="Generated Cover Letter" />

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* top bar */}
        <div
          style={{
            padding: '10px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--graphite)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.25em',
              color: 'var(--muted)',
              textTransform: 'uppercase',
            }}
          >
            Cover Letter · Draft
          </div>

          <button
            onClick={handleCopy}
            style={{
              padding: '5px 14px',
              border: `1px solid ${copied ? `rgba(106,171,126,0.5)` : 'var(--border)'}`,
              borderRadius: 2,
              background: copied ? 'rgba(106,171,126,0.1)' : 'transparent',
              color: copied ? 'var(--success)' : 'var(--muted)',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>

        {/* content */}
        <div
          style={{
            padding: '28px 32px',
            maxHeight: 520,
            overflowY: 'auto',
          }}
        >
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                fontSize: 14,
                color: 'var(--silver)',
                lineHeight: 1.85,
                marginBottom: para.length < 60 ? 20 : 14,
                fontWeight: para.length < 60 && i === 0 ? 500 : 400,
                color: para.length < 60 && i === 0 ? CHAMPAGNE : 'var(--silver)',
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* bottom shimmer fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 40,
            background: 'linear-gradient(to top, var(--surface), transparent)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  )
}
