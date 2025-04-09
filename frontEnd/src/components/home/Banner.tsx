import { Link } from 'react-router-dom';
import banner from '../../assets/commonPages/banner.webp';

const Banner = () => {
  return (
    <div
      className="w-full h-[60vh] sm:h-[80vh] md:h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${banner})` }}
    >
      {/* Overlay for brightness adjustment */}
      <div className="absolute inset-0 bg-black bg-opacity-40 sm:bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
          Grow Your Skills with Online Courses at <span className="text-green-500">TechWorld</span>
        </h1>
        <p className="text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8">
          TechWorld is your go-to platform for online learning. Explore courses in web development, machine learning, and more, tailored to help you succeed in the tech industry.
        </p>
        <Link to={'/courseList'}>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-md font-semibold shadow-md transition duration-300 text-sm sm:text-base">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;