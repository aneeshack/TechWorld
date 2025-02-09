import teach from '../../assets/commonPages/teaching.avif';
import teacher from '../../assets/commonPages/teacher.jpg';
import online from '../../assets/commonPages/onlineClass.avif'
import { useNavigate } from 'react-router-dom';

const TeachBanner = () => {
  const navigate = useNavigate();

  const handleLogin =()=>{
    navigate('/login',{state:{role:'instructor'}})
  }
  const handleSignup =()=>{
    navigate('/signup',{state:{role:'instructor'}})
  }
  return (
    <div>
      <div 
        className="w-full h-[50vh] md:h-[70vh] mx-auto mt-5 bg-cover bg-center relative max-w-7xl" 
        style={{ backgroundImage: `url(${teach})` }}
      ></div>
      
      <section className="container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <img src={teacher} alt="Instructor" className="w-full rounded-lg shadow-md" />
          <div className='flex flex-col justify-center'>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-10">Share Your Passion</h2>
            <p className="text-gray-700 mb-4 md:mb-6">
              Do you have a skill or expertise you'd love to share with the world? Become an instructor on our platform and empower others to learn and grow.
            </p>
            <ul className="list-disc pl-4 md:pl-6 text-gray-700 mb-4 md:mb-6">
              <li>Reach a global audience of eager learners.</li>
              <li>Build your personal brand and establish yourself as an expert.</li>
              <li>Earn passive income by sharing your knowledge.</li>
            </ul>
            <button className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg w-full md:w-auto">
              <a onClick={handleSignup}> Apply Now</a>
            </button>
            <p  className=" text-sm mt-4 ">Already an instructor? 
            <a onClick={handleLogin} className='hover:underline ml-3 text-lg cursor-pointer text-green-500'>Login</a> </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Why Teach With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl text-green-900 mb-4">🚀</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Expand Your Reach</h3>
              <p className="text-gray-700">Connect with students from all corners of the globe.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-green-900 mb-4">💰</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Generate Income</h3>
              <p className="text-gray-700">Monetize your expertise and create a sustainable income stream.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-green-900 mb-4">🧑‍🤝‍🧑</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Join Our Community</h3>
              <p className="text-gray-700">Become part of a supportive network of instructors.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <img src={online} alt="Teaching" className="w-full rounded-lg shadow-md " />
        </div>
      </section>
    </div>
  );
};

export default TeachBanner;
