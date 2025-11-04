import { Github, Linkedin, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 pb-6 border-t border-gray-200">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <a 
            href="https://github.com/" 
            target="_blank" 
            rel="noreferrer" 
            className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-300 hover:scale-110" 
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a 
            href="https://www.linkedin.com/" 
            target="_blank" 
            rel="noreferrer" 
            className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-700 hover:text-white transition-all duration-300 hover:scale-110" 
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        </div>
        <p className="text-gray-700 font-medium flex items-center justify-center gap-2">
          Developed with <Heart className="w-4 h-4 text-red-500 fill-current" /> by 
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Masna Manideep</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">Powered by Machine Learning & Modern Web Technologies</p>
      </div>
    </footer>
  )
}
