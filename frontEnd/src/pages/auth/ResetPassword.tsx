import logo from '../../assets/logo.png';
import reset from '../../assets/login.avif';

const ResetPassword = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row bg-white">
      {/* Left Section */}
      <div className="lg:w-1/2 relative w-full h-screen flex flex-col items-center justify-center bg-white-100">
        <div className="absolute top-4 left-4">
          <img src={logo} alt="logo" className="w-auto h-16" />
        </div>
        <img
          src={reset}
          alt="reset password"
          className="w-11/12 h-3/4 lg:w-[600px] object-cover"
        />
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center bg-white-100">
        <div className="w-3/4 lg:w-[400px] bg-gray-50 p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-green-700 text-center mb-6">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            Create a new password for your account.
          </p>
          <form className="flex flex-col">
            <input
              type="password"
              placeholder="New Password"
              className="mb-4 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="mb-6 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              Reset Password
            </button>
          </form>
          <div className="text-center mt-6">
            <a href="/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
