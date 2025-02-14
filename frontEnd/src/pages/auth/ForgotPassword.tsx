import logo from '../../assets/commonPages/logo.png'
import forgot from '../../assets/auth/login.avif'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CLIENT_API } from '../../utilities/axios/Axios'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'


const ForgotPassword = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('')
  const [userRole, setUserRole]= useState(location.state?.role)

  useEffect(()=>{
    if(userRole){
      setUserRole(userRole)
      console.log('user role',userRole)
    }
  },[userRole])

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();

    if(!email){
      setMessage("Please enter a valid email")
      return
    }
    console.log('userrole',userRole)
    try {
      const response =await CLIENT_API.post('/forgotPass',{email,role:userRole})
      console.log('response',response.data.message);
      if(response && response.data){
        toast.success(response.data.message)
        localStorage.setItem("forgotPasswordEmail", email);
          
        // Set OTP expiry time for first OTP
        const newExpiryTime = Math.floor(Date.now() / 1000) + 30;
        localStorage.setItem('otpExpiryTime', String(newExpiryTime));
        navigate('/resetPassOtp',{state:{role: userRole, email: email}})
        
      }
    } catch (error:unknown) {
      console.log('Error',error)
      if (error instanceof AxiosError) { 
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        toast.error(errorMessage);
      } else {
        toast.error('An unknown error occurred');
      }
    }

  }

  const handleLogin =()=>{
    navigate('/login',{state:{role:userRole}})
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white">
    <div className="lg:w-1/2 relative w-full h-screen flex flex-col items-center justify-center bg-white-100">
  <div className='absolute top-4 left-4'>
  <img src={logo} alt="logo" className='w-auto h-16' />
  </div>
    <img src={forgot} alt="signup" className="w-11/12 h-3/4 lg:w-[600px] object-cover" />
  </div>

  {/* Right Section */}
  <div className="lg:w-1/2 w-full flex items-center justify-center bg-white-100">
        <div className="w-3/4 lg:w-[400px] bg-gray-50 p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-green-700 text-center mb-6">
            Forgot Password
          </h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            Enter your registered email address to receive a password reset link.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="mb-6 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            {message && <p className='text-center text-red-600 mb-4'>{message}</p>}
            <button
              type="submit"
              className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              SEND OTP
            </button>
          </form>
          <div className="text-center mt-6">
            <a href="" onClick={handleLogin} className="text-sm text-blue-600 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      </div>
</div>
  )
}

export default ForgotPassword