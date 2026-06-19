import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NeuralPolaris from './NeuralPolaris'
import ParticleField from './ParticleField'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'

const STAGES = [
  'Resume Ingested',
  'Extracting Candidate Profile',
  'Evaluating ATS Readiness',
  'Mapping Career Opportunities',
  'Detecting Skill Gaps',
  'Building Learning Orbit',
  'Preparing Interview Lab',
  'Forging Cover Letter',
]

const FEED_MESSAGES = [
  'Parsing resume structure...',
  'Extracting technical capabilities...',
  'Identified project portfolio',
  'Calculating ATS readiness...',
  'Matching career pathways...',
  'Building learning roadmap...',
  'Generating interview simulations...',
]

const COMPLETION_ITEMS = [
  'ATS Evaluation Complete',
  'Career Mapping Complete',
  'Skill Gap Matrix Generated',
  'Interview Lab Prepared',
]

function StagePipeline({ currentIndex }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        width: '100%',
        maxWidth: 340,
        margin: '0 auto',
      }}
    >
      {STAGES.map((label, i) => {
        const isDone = i < currentIndex
        const isCurrent = i === currentIndex
        return (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 11,
              letterSpacing: '0.02em',
            }}
          >
            {isCurrent ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 14,
                  textAlign: 'center',
                  flexShrink: 0,
                  color: GOLD,
                  textShadow: `0 0 10px ${GOLD}`,
                }}
              >
                ●
              </motion.span>
            ) : (
              <span
                style={{
                  width: 14,
                  textAlign: 'center',
                  flexShrink: 0,
                  color: isDone ? GOLD : 'var(--muted)',
                }}
              >
                {isDone ? '✓' : '○'}
              </span>
            )}
            <span
              style={{
                color: isDone || isCurrent ? CHAMPAGNE : 'var(--muted)',
                fontWeight: isCurrent ? 500 : 400,
                opacity: isDone ? 0.75 : isCurrent ? 1 : 0.45,
                transition: 'opacity 0.4s ease, color 0.4s ease',
              }}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function IntelligenceFeed({ index }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 10.5,
        color: 'var(--muted)',
        letterSpacing: '0.02em',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span style={{ color: GOLD, opacity: 0.7 }}>›</span>
          {FEED_MESSAGES[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function CompletionPanel() {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: '0.3em',
          color: GOLD,
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        Analysis Complete
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
        {COMPLETION_ITEMS.map((label) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              color: CHAMPAGNE,
            }}
          >
            <span style={{ color: GOLD }}>✓</span>
            {label}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function UploadChamber({ onAnalyze, loading, error }) {
  const [drag, setDrag] = useState(false)
  const [file, setFile] = useState(null)
  const fileRef = useRef(null)

  const [stageIndex, setStageIndex] = useState(1)
  const [feedIndex, setFeedIndex] = useState(0)
  const [showComplete, setShowComplete] = useState(false)
  const wasLoadingRef = useRef(false)

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      alert('Please upload a PDF file.')
      return
    }
    setFile(f)
  }

  // Drive the stage pipeline + intelligence feed while loading is true
  useEffect(() => {
    if (!loading) return

    setStageIndex(1)
    setFeedIndex(0)

    const stageTimer = setInterval(() => {
      setStageIndex((i) => (i < STAGES.length - 1 ? i + 1 : i))
    }, 1000)

    const feedTimer = setInterval(() => {
      setFeedIndex((i) => (i + 1) % FEED_MESSAGES.length)
    }, 1200)

    return () => {
      clearInterval(stageTimer)
      clearInterval(feedTimer)
    }
  }, [loading])

  // Brief "Analysis Complete" moment when loading finishes successfully
  useEffect(() => {
    if (wasLoadingRef.current && !loading && !error) {
      setShowComplete(true)
      const t = setTimeout(() => setShowComplete(false), 1000)
      wasLoadingRef.current = loading
      return () => clearTimeout(t)
    }
    wasLoadingRef.current = loading
  }, [loading, error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--black)',
      }}
    >
      {/* nav */}
      <nav
        style={{
          padding: '0 32px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <NeuralPolaris size={30} animate />
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: CHAMPAGNE,
            }}
          >
            NAVIX
          </span>
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.28em',
            color: 'var(--muted)',
            textTransform: 'uppercase',
          }}
        >
          Intelligence Intake
        </div>
      </nav>

      {/* main */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ParticleField count={45} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 560,
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center' }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.32em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Resume Analysis
            </div>
            <div
              style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 600,
                color: CHAMPAGNE,
                letterSpacing: '-0.02em',
              }}
            >
              Upload Your Resume
            </div>
            <div
              style={{
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)`,
                marginTop: 14,
              }}
            />
          </motion.div>

          {/* drop zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ width: '100%' }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDrag(false)
                handleFile(e.dataTransfer.files[0])
              }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `1px solid ${drag ? GOLD : 'rgba(201,168,76,0.25)'}`,
                borderRadius: 4,
                padding: '52px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: drag ? 'rgba(201,168,76,0.07)' : 'rgba(201,168,76,0.02)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {/* top shimmer */}
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                  pointerEvents: 'none',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <NeuralPolaris size={60} animate={!file} />
              </div>

              <AnimatePresence>
                {file && !loading && !showComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.22em',
                      color: GOLD,
                      textTransform: 'uppercase',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span>✓</span> PDF Successfully Loaded
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                style={{
                  fontSize: 14,
                  color: file ? CHAMPAGNE : 'var(--silver)',
                  fontWeight: file ? 500 : 400,
                  marginBottom: 6,
                }}
              >
                {file ? file.name : 'Drop your PDF resume here'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB · Document Ready`
                  : 'PDF · Click or drag to upload'}
              </div>
            </div>
          </motion.div>

          {/* actions */}
          <AnimatePresence>
            {file && !loading && !showComplete && (
              <motion.button
                key="analyze-btn"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => onAnalyze(file)}
                style={{
                  padding: '14px 60px',
                  background: `linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))`,
                  border: `1px solid rgba(201,168,76,0.55)`,
                  borderRadius: 2,
                  color: CHAMPAGNE,
                  fontSize: 11,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                whileHover={{ scale: 1.02, borderColor: GOLD }}
                whileTap={{ scale: 0.98 }}
              >
                Run Intelligence Analysis
              </motion.button>
            )}

            {loading && !showComplete && (
              <motion.div
                key="pipeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 22,
                  width: '100%',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                  style={{
                    display: 'inline-flex',
                    filter: `drop-shadow(0 0 14px ${GOLD}90)`,
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <NeuralPolaris size={40} animate />
                  </motion.div>
                </motion.div>

                <StagePipeline currentIndex={stageIndex} />
                <IntelligenceFeed index={feedIndex} />
              </motion.div>
            )}

            {showComplete && <CompletionPanel />}
          </AnimatePresence>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  color: 'var(--danger)',
                  fontSize: 12,
                  textAlign: 'center',
                  lineHeight: 1.7,
                  padding: '12px 16px',
                  border: '1px solid rgba(192,97,74,0.3)',
                  borderRadius: 3,
                  background: 'rgba(192,97,74,0.06)',
                  maxWidth: '100%',
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}