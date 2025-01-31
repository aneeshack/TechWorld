import LeftSection from '../../components/signup/LeftSection'
import google from '../../assets/google.jpeg'
const Login = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row bg-white">
        <LeftSection/>
        <div className="lg:w-1/2 w-full flex items-center justify-center bg-white-100">
        <div className="w-3/4 h-3/4 lg:w-[500px] lg:h-5/6 bg-gray-200 p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-green-700 text-center mb-[100px]">
            LOGIN
          </h1>
          <form className="flex flex-col">
            <input
              type="text"
              placeholder="Enter your Email"
              className="mb-4 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="password"
              placeholder="Enter the Password"
              className="mb-6 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              LOGIN
            </button>
          </form>
           <div className="text-center mt-4">
            <a href="/forgotPass" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <div className="flex items-center justify-center mt-5">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-sm text-gray-600 mx-2">OR</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          <button
            type="button"
            className="flex items-center justify-center w-full mt-5 bg-white text-gray-700 border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition duration-300"
          >
            <img
              src={google}
              alt="Google Icon"
              className="w-5 h-5 mr-3"
            />
            Login with Google
          </button>

          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              Are you a new User?{' '}
              <a href="/signup" className="text-blue-600 hover:underline">
                Signup
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login