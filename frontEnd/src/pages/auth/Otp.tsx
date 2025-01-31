import logo from '../../assets/logo.png';
import otp from '../../assets/otp.avif'

const Otp = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row bg-white">
        <div className="lg:w-1/2 relative w-full h-screen flex flex-col items-center justify-center bg-white-100">
      <div className='absolute top-4 left-4'>
      <img src={logo} alt="logo" className='w-auto h-16' />
      </div>
        <img src={otp} alt="signup" className="w-11/12 h-3/4 lg:w-[600px] object-cover" />
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center bg-white-100">
      <div className="w-3/4 lg:w-[400px] bg-gray-50 p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-green-700 text-center mb-6">Verify OTP</h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            Enter the OTP sent to your registered email/phone number.
          </p>
          <form className="flex flex-col">
            <input
              type="text"
              placeholder="Enter OTP"
              className="mb-6 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-center"
            />
            <button
              type="submit"
              className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              Verify
            </button>
          </form>
          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              Didn't receive an OTP?{' '}
              <button className="text-blue-600 hover:underline">
                Resend OTP
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Otp