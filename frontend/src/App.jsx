import './App.css'
import SpamAnalyzer from './components/SpamAnalyzer'
import InfoCard from './components/InfoCard'
import Footer from './components/Footer'
import { motion } from 'framer-motion'
import MetricsPanel from './components/MetricsPanel'
import TrainingPipeline from './components/TrainingPipeline'
import { Shield, Sparkles } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-lavender/10">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-gradient opacity-5"></div>
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-full shadow-sm border border-lavender/30">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Email Protection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6a11cb] to-[#2575fc]">Real-Time Spam Detection</span>
              <br />
              <span className="text-gray-800">using Perceptron</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Paste any email below and let our trained perceptron model analyze it instantly.
              <br className="hidden md:block" />
              Get real-time predictions with confidence scores.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lavender to-transparent"></div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Analyzer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SpamAnalyzer />
        </motion.div>

        {/* Info & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <InfoCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MetricsPanel />
          </motion.div>
        </div>

        {/* Training Pipeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <TrainingPipeline />
        </motion.div>

        <Footer />
      </main>
    </div>
  )
}
