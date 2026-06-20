import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'

import IntroScreen from './components/IntroScreen'
import UploadChamber from './components/UploadChamber'
import ResultsOS from './components/ResultsOS'

export default function App() {
  const [screen, setScreen] = useState('intro') // intro | upload | results
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await axios.post('https://navix-backend-quf3.onrender.com/analyze-resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setData(res.data)

      setTimeout(() => {
        setScreen('results')
      }, 1200)
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        'Backend unreachable. Ensure FastAPI is running on port 8000.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setData(null)
    setError(null)
    setScreen('upload')
  }, [])

  return (
    <AnimatePresence mode="wait">
      {screen === 'intro' && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <IntroScreen onEnter={() => setScreen('upload')} />
        </motion.div>
      )}

      {screen === 'upload' && (
        <motion.div
          key="upload"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ minHeight: '100vh' }}
        >
          <UploadChamber
            onAnalyze={handleAnalyze}
            loading={loading}
            error={error}
          />
        </motion.div>
      )}

      {screen === 'results' && data && (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ minHeight: '100vh' }}
        >
          <ResultsOS data={data} onReset={handleReset} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
