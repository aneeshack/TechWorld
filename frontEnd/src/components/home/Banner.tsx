import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import banner from '../../assets/commonPages/banner.webp';

const Banner = () => {
  return (
    <div
      className="w-full h-[60vh] sm:h-[80vh] md:h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${banner})` }}
    >
      {/* Overlay with subtle zoom effect on hover */}
      <motion.div 
        className="absolute inset-0 bg-black bg-opacity-40 sm:bg-opacity-50 transition-all duration-700"
        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl">
        <motion.h1 
          className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
          initial={{ opacity: 1 }}
          whileHover={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.5)" }}
        >
          Grow Your Skills with Online Courses at{" "}
          <motion.span 
            className="text-green-500 inline-block"
            whileHover={{ 
              color: "#4ade80", 
              textShadow: "0 0 12px rgba(74, 222, 128, 0.6)",
              transition: { duration: 0.2 }
            }}
          >
            TechWorld
          </motion.span>
        </motion.h1>
        
        <motion.p 
          className="text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8"
          whileHover={{ 
            color: "#ffffff",
            transition: { duration: 0.3 }
          }}
        >
          TechWorld is your go-to platform for online learning. Explore courses in web development, 
          machine learning, and more, tailored to help you succeed in the tech industry.
        </motion.p>
        
        <Link to={'/courseList'}>
          <motion.button 
            className="bg-green-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-md font-semibold shadow-md text-sm sm:text-base relative overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#16a34a",
              boxShadow: "0 0 20px rgba(22, 163, 74, 0.5)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.span 
              className="absolute inset-0 w-0 bg-white bg-opacity-20"
              whileHover={{ 
                width: "100%", 
                transition: { duration: 0.3 }
              }}
            />
            <span className="relative z-10">Get Started</span>
          </motion.button>
        </Link>
      </div>

      {/* Decorative elements that react to overall hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0"
        whileHover={{ 
          opacity: 0.7,
          transition: { duration: 0.5 }
        }}
      />
    </div>
  );
};

export default Banner;