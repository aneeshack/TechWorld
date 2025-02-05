import banner from '../../assets/banner.webp';

const Banner = () => {
  return (
    
      <div
        className="w-full h-screen bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        {/* Overlay for brightness adjustment */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 mt-8 leading-tight">
            Grow Your Skills with Online Courses at <span className="text-green-500">TechWorld</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8">
            TechWorld is your go-to platform for online learning. Explore courses in web development, machine learning, and more, tailored to help you succeed in the tech industry.
          </p>
          <button className="bg-green-600 hover:bg-green-600 text-white px-8 py-3 rounded-md font-semibold shadow-md transition duration-300">
            Get Started
          </button>
        </div>
      </div>
  
  );
};

export default Banner;

