import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { predictSpam } from '../lib/api'
import { Mail, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef()
  return useMemo(() => (value) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => callback(value), delay)
  }, [callback, delay])
}

export default function SpamAnalyzer() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = async (content) => {
    const trimmed = content.trim()
    if (!trimmed) {
      setResult(null)
      setError('')
      return
    }
    try {
      setLoading(true)
      setError('')
      const data = await predictSpam(trimmed)
      setResult({
        prediction: data?.prediction || null,
        confidence: typeof data?.confidence === 'number' ? data.confidence : undefined,
      })
    } catch (e) {
      setError('Failed to analyze. Ensure backend is running at http://127.0.0.1:5000/predict')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const debouncedAnalyze = useDebouncedCallback(analyze, 1200)

  useEffect(() => {
    debouncedAnalyze(text)
  }, [text])

  const isSpam = result?.prediction === 'Spam'
  const isHam = result?.prediction === 'Ham'

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Email Analyzer</h2>
            <p className="text-sm text-gray-500">Paste or type your email content below</p>
          </div>
        </div>
        <textarea
          className="w-full min-h-56 md:min-h-64 resize-y rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-5 text-gray-800 placeholder:text-gray-400 transition-all duration-200 bg-gray-50 focus:bg-white"
          placeholder="Paste your email content here...\n\nExample: Congratulations! You've won a free prize. Click here to claim now!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => analyze(text)}
            className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#6a11cb] to-[#2575fc] hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            disabled={loading || !text.trim()}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {loading ? 'Analyzing...' : 'Check Email'}
          </button>
        </div>

        <div className="mt-8">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 rounded-xl border-2 ${isSpam ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isSpam ? (
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-600">Classification Result</p>
                      <p className={`text-2xl font-bold ${isSpam ? 'text-red-700' : 'text-green-700'}`}>
                        {isSpam ? '🚫 Spam Detected' : '✅ Safe Email (Ham)'}
                      </p>
                    </div>
                  </div>
                  {typeof result?.confidence === 'number' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-3xl font-bold text-gray-800">{(result.confidence * 100).toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
