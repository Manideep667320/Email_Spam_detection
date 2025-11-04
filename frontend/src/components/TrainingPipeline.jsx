import { motion } from 'framer-motion'
import { Database, FileText, Filter, Zap, Target, CheckCircle, ArrowRight, Layers } from 'lucide-react'

export default function TrainingPipeline() {
  const steps = [
    {
      icon: Database,
      title: 'Dataset Loading',
      description: 'Enron email dataset with labeled Ham and Spam emails',
      color: 'from-blue-500 to-cyan-600',
      details: ['Ham emails from dataset/ham/', 'Spam emails from dataset/spam/', 'Parse email headers & body']
    },
    {
      icon: Filter,
      title: 'Preprocessing',
      description: 'Clean and normalize text, extract features',
      color: 'from-purple-500 to-pink-600',
      details: ['Remove HTML tags & stopwords', 'Porter stemming', 'Extract link features (URLs, IPs, TLDs)']
    },
    {
      icon: Layers,
      title: 'Feature Extraction',
      description: 'Convert text to numerical features',
      color: 'from-orange-500 to-red-600',
      details: ['TF-IDF vectorization (1-2 grams)', 'Link-based features (5 numeric)', 'StandardScaler normalization']
    },
    {
      icon: Zap,
      title: 'Perceptron Training',
      description: 'Learn weights to classify spam vs ham',
      color: 'from-green-500 to-teal-600',
      details: ['Max 50 iterations', 'Learning rate η=1.0', 'Update weights on errors']
    },
    {
      icon: Target,
      title: 'Model Evaluation',
      description: 'Test on unseen data and save artifacts',
      color: 'from-indigo-500 to-purple-600',
      details: ['80/20 train-test split', 'Confusion matrix & metrics', 'Save to models/perceptron_model.joblib']
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Training Pipeline</h3>
          <p className="text-sm text-gray-600">How the Perceptron learns from the dataset</p>
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="space-y-6 mb-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">{step.title}</h4>
                  <span className="text-xs font-semibold text-gray-500">Step {idx + 1}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                <ul className="space-y-1">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Arrow connector */}
            {idx < steps.length - 1 && (
              <div className="ml-6 mt-3 mb-3 flex items-center gap-2 text-gray-400">
                <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Perceptron Diagram */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Perceptron Architecture
        </h4>
        
        <div className="flex flex-col items-center gap-6">
          {/* Input Layer */}
          <div className="w-full">
            <p className="text-xs font-semibold text-gray-600 mb-2 text-center">Input Features</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['TF-IDF Features', 'URL Count', 'IP URLs', 'Suspicious TLDs', 'Shorteners', 'Verify/Urgent'].map((feat, i) => (
                <div key={i} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                  {feat}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
            <span className="text-xs text-gray-500 mt-1">Weighted Sum</span>
          </div>

          {/* Perceptron Node */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <div className="text-center text-white">
                <Zap className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs font-bold">Perceptron</p>
                <p className="text-xs opacity-80">Σ(w·x) + b</p>
              </div>
            </div>
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-300 shadow-sm">
              Activation
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
            <span className="text-xs text-gray-500 mt-1">Decision</span>
          </div>

          {/* Output Layer */}
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-bold border-2 border-green-300 shadow-md">
              Ham (0)
            </div>
            <div className="px-6 py-3 bg-red-100 text-red-700 rounded-xl font-bold border-2 border-red-300 shadow-md">
              Spam (1)
            </div>
          </div>
        </div>

        {/* Training Formula */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-300">
          <p className="text-xs font-semibold text-gray-700 mb-2">Weight Update Rule:</p>
          <code className="text-sm font-mono text-indigo-700">
            w<sub>new</sub> = w<sub>old</sub> + η × (y<sub>true</sub> - y<sub>pred</sub>) × x
          </code>
          <p className="text-xs text-gray-600 mt-2">
            Where η (eta) = learning rate, y = label, x = input features
          </p>
        </div>
      </div>

      {/* Dataset Access Info */}
      <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-gray-900 mb-2">Dataset Access During Training</h5>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>Location:</strong> <code className="text-xs bg-white px-2 py-0.5 rounded border">dataset/ham/</code> and <code className="text-xs bg-white px-2 py-0.5 rounded border">dataset/spam/</code></span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>Format:</strong> Raw .txt email files parsed using Python's email library</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>Processing:</strong> Each email is cleaned, vectorized, and combined with link features before feeding to the perceptron</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>Output:</strong> Trained model saved to <code className="text-xs bg-white px-2 py-0.5 rounded border">models/perceptron_model.joblib</code></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
