import { motion } from 'framer-motion'
import { Brain, Zap, Code } from 'lucide-react'

export default function InfoCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">About the Project</h3>
      </div>
      <div className="space-y-5 text-sm text-gray-600">
        <div className="flex gap-3">
          <Brain className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800 mb-1.5">What is a Perceptron?</p>
            <p className="leading-relaxed">A perceptron is a simple linear classifier that learns weights to separate classes. Here, it distinguishes spam vs ham based on features learned during training.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800 mb-1.5">How Spam Detection Works</p>
            <p className="leading-relaxed">The trained model processes the email text and predicts a label. The frontend sends your text to a Flask API and displays the prediction in real time.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Code className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-800 mb-1.5">Technologies Used</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">React + Vite</span>
              <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium">Tailwind CSS</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">Framer Motion</span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">Flask</span>
              <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">ML Perceptron</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
