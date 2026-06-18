import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NeuralPolaris from './NeuralPolaris'
import ParticleField from './ParticleField'

const GOLD = '#c9a84c'
const CHAMPAGNE = '#e8d5a3'

export default function UploadChamber({ onAnalyze, loading, error }) {
  const [drag, setDrag] = useState(false)
  const [file, setFile] = useState(null)
  const fileRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      alert('Please upload a PDF file.')
      return
    }
    setFile(f)
  }

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
                  ? `${(file.size / 1024).toFixed(1)} KB · PDF ready`
                  : 'PDF · Click or drag to upload'}
              </div>
            </div>
          </motion.div>

          {/* actions */}
          <AnimatePresence>
            {file && !loading && (
              <motion.button
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

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <NeuralPolaris size={40} animate />
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.28em',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  Analysing…
                </div>
              </motion.div>
            )}
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
