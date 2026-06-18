import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import NeuralPolaris from './NeuralPolaris'
import ATSEngine from './chambers/ATSEngine'
import CareerMatch from './chambers/CareerMatch'
import GapMatrix from './chambers/GapMatrix'
import LearningOrbit from './chambers/LearningOrbit'
import InterviewLab from './chambers/InterviewLab'
import CoverLetterForge from './chambers/CoverLetterForge'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'

const SECTIONS = [
  { id: 'ats', label: 'ATS Engine', short: 'ATS' },
  { id: 'roles', label: 'Career Match', short: 'Roles' },
  { id: 'gaps', label: 'Gap Matrix', short: 'Gaps' },
  { id: 'learning', label: 'Learning Orbit', short: 'Learn' },
  { id: 'interview', label: 'Interview Lab', short: 'Interview' },
  { id: 'cover', label: 'Cover Letter', short: 'Cover' },
]

export default function ResultsOS({ data, onReset }) {
  const [section, setSection] = useState('ats')

  const candidate = data?.candidate || {}
  const candidateName = candidate.name || 'Candidate'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', flexDirection: 'column' }}>
      {/* topbar */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(17,17,19,0.92)',
          backdropFilter: 'blur(12px)',
          gap: 16,
        }}
      >
        {/* left: logo + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <NeuralPolaris size={26} animate />
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', color: CHAMPAGNE }}>
            NAVIX
          </span>
          <span style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '0.18em' }}>
            // {candidateName}
          </span>
        </div>

        {/* center: section nav */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 3,
            overflow: 'hidden',
            flexShrink: 1,
            flexWrap: 'nowrap',
          }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              style={{
                padding: '7px 14px',
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: section === s.id ? `rgba(201,168,76,0.15)` : 'transparent',
                color: section === s.id ? CHAMPAGNE : 'var(--muted)',
                borderRight: '1px solid var(--border)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="nav-full">{s.label}</span>
              <span className="nav-short" style={{ display: 'none' }}>{s.short}</span>
            </button>
          ))}
        </div>

        {/* right: reset */}
        <button
          onClick={onReset}
          style={{
            fontSize: 10,
            color: 'var(--muted)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '6px 12px',
            border: '1px solid var(--border)',
            borderRadius: 2,
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = CHAMPAGNE
            e.currentTarget.style.borderColor = `rgba(201,168,76,0.5)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--muted)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          New Analysis
        </button>
      </nav>

      {/* candidate summary strip */}
      <CandidateStrip candidate={candidate} atsScore={data?.ats_score} />

      {/* chamber content */}
      <div style={{ flex: 1, padding: '36px clamp(16px, 4vw, 48px)', maxWidth: 1140, width: '100%', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {section === 'ats' && (
            <ChamberWrap key="ats">
              <ATSEngine
                atsScore={data?.ats_score}
                topJobs={data?.top_jobs}
                candidate={candidate}
              />
            </ChamberWrap>
          )}
          {section === 'roles' && (
            <ChamberWrap key="roles">
              <CareerMatch roles={data?.roles} />
            </ChamberWrap>
          )}
          {section === 'gaps' && (
            <ChamberWrap key="gaps">
              <GapMatrix skillGaps={data?.skill_gaps} />
            </ChamberWrap>
          )}
          {section === 'learning' && (
            <ChamberWrap key="learning">
              <LearningOrbit resources={data?.learning_resources} />
            </ChamberWrap>
          )}
          {section === 'interview' && (
            <ChamberWrap key="interview">
              <InterviewLab
                questions={data?.interview_questions}
                mockInterview={data?.mock_interview}
              />
            </ChamberWrap>
          )}
          {section === 'cover' && (
            <ChamberWrap key="cover">
              <CoverLetterForge text={data?.cover_letter} />
            </ChamberWrap>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ChamberWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function CandidateStrip({ candidate, atsScore }) {
  const fields = [
    { label: 'Name', value: candidate.name },
    { label: 'Email', value: candidate.email },
    { label: 'Role', value: candidate.current_role || candidate.title },
    {
      label: 'Experience',
      value: Array.isArray(candidate.experience)
      ? candidate.experience
        .map(exp => exp.title)
        .filter(Boolean)
        .join(', ')
      : candidate.experience,
    },
    { label: 'Location', value: candidate.location },
    { label: 'ATS Score', value: atsScore != null ? `${atsScore} / 100` : null },
  ].filter((f) => f.value != null)

  if (!fields.length) return null

  return (
    <div
      style={{
        padding: '12px clamp(16px, 4vw, 48px)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--graphite)',
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {fields.map((f) => (
        <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--dim)', textTransform: 'uppercase' }}>
            {f.label}
          </div>
          <div style={{ fontSize: 12, color: f.label === 'ATS Score' ? GOLD : CHAMPAGNE, fontWeight: 500 }}>
            {f.value}
          </div>
        </div>
      ))}
    </div>
  )
}
