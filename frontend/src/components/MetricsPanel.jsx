import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getMetrics } from '../lib/api'
import { BarChart3, TrendingUp, Target } from 'lucide-react'

function MetricBadge({ label, value, color, icon: Icon }) {
  return (
    <div className={`rounded-xl px-4 py-3 ${color} border-2 flex items-center gap-3 hover:scale-105 transition-transform`}>
      {Icon && <Icon className="w-5 h-5" />}
      <div>
        <p className="text-xs font-medium opacity-80">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export default function MetricsPanel() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await getMetrics()
        setMetrics(data)
      } catch (e) {
        setError('Failed to load metrics. Make sure training has generated results.json and backend is running.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const report = metrics?.classification_report
  const cm = metrics?.confusion_matrix

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Model Analytics</h3>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Loading metrics…</p>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-700">{error}</p>
        </div>
      )}

      {!loading && !error && report && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MetricBadge 
              label="Accuracy" 
              value={(report.accuracy * 100).toFixed(1) + '%'} 
              color="bg-indigo-50 text-indigo-700 border-indigo-200" 
              icon={Target}
            />
            <MetricBadge 
              label="Spam F1" 
              value={(report.Spam?.['f1-score'] * 100).toFixed(1) + '%'} 
              color="bg-red-50 text-red-700 border-red-200" 
              icon={TrendingUp}
            />
            <MetricBadge 
              label="Ham F1" 
              value={(report.Ham?.['f1-score'] * 100).toFixed(1) + '%'} 
              color="bg-green-50 text-green-700 border-green-200" 
              icon={TrendingUp}
            />
          </div>

          {cm && Array.isArray(cm) && cm.length === 2 && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
              <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Confusion Matrix
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <div className="bg-white rounded-lg border-2 border-green-200 p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{cm[0][0]}</p>
                  <p className="text-xs text-gray-600 mt-1">True Ham</p>
                </div>
                <div className="bg-white rounded-lg border-2 border-red-200 p-4 text-center">
                  <p className="text-2xl font-bold text-red-700">{cm[0][1]}</p>
                  <p className="text-xs text-gray-600 mt-1">False Spam</p>
                </div>
                <div className="bg-white rounded-lg border-2 border-red-200 p-4 text-center">
                  <p className="text-2xl font-bold text-red-700">{cm[1][0]}</p>
                  <p className="text-xs text-gray-600 mt-1">False Ham</p>
                </div>
                <div className="bg-white rounded-lg border-2 border-green-200 p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{cm[1][1]}</p>
                  <p className="text-xs text-gray-600 mt-1">True Spam</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">Rows: Actual • Cols: Predicted</div>
            </div>
          )}

          <div className="overflow-x-auto bg-gray-50 rounded-xl p-4 border border-gray-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-300">
                  <th className="py-3 pr-6 font-semibold">Class</th>
                  <th className="py-3 pr-6 font-semibold">Precision</th>
                  <th className="py-3 pr-6 font-semibold">Recall</th>
                  <th className="py-3 pr-6 font-semibold">F1-Score</th>
                  <th className="py-3 pr-6 font-semibold">Support</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {['Ham','Spam'].map((k, idx) => (
                  <tr key={k} className={idx === 0 ? 'border-b border-gray-200' : ''}>
                    <td className="py-3 pr-6 font-bold">{k}</td>
                    <td className="py-3 pr-6">{(report[k]?.precision * 100).toFixed(1)}%</td>
                    <td className="py-3 pr-6">{(report[k]?.recall * 100).toFixed(1)}%</td>
                    <td className="py-3 pr-6">{(report[k]?.['f1-score'] * 100).toFixed(1)}%</td>
                    <td className="py-3 pr-6">{report[k]?.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
