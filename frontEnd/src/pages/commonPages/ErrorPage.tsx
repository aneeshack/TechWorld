import { ArrowLeft } from 'lucide-react';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center max-w-lg">
        {/* Animated SVG illustration */}
        <div className="mb-8 relative">
          <svg viewBox="0 0 200 120" className="w-full h-auto">
            {/* Background shapes */}
            <circle cx="100" cy="60" r="50" fill="#f0f9ff" stroke="#e0f2fe" strokeWidth="2" />
            <path d="M30,100 Q100,20 170,100" stroke="#bae6fd" strokeWidth="2" fill="none" />
            
            {/* 404 Text */}
            <text x="52" y="75" fontFamily="sans-serif" fontSize="36" fontWeight="bold" fill="#0284c7">
              404
            </text>
            
            {/* Animated elements */}
            <g className="animate-bounce">
              <circle cx="36" cy="50" r="6" fill="#38bdf8" />
            </g>
            <g className="animate-pulse">
              <circle cx="160" cy="50" r="8" fill="#0ea5e9" />
            </g>
            <g className="animate-bounce">
              <path d="M80,30 L85,40 L75,40 Z" fill="#0369a1" />
            </g>
            <g className="animate-pulse">
              <path d="M120,30 L125,40 L115,40 Z" fill="#0284c7" />
            </g>
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for seems to have wandered off into the digital wilderness.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 w-full"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
          
          <a 
            href="/" 
            className="inline-block text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
          >
            Or return to home page
          </a>
        </div>
      </div>
      
      <div className="mt-16 text-gray-400 text-sm">
        © {new Date().getFullYear()} Your Company Name
      </div>
    </div>
  );
};

export default ErrorPage;