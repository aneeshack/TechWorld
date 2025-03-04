// import { useSelector } from 'react-redux';
import logo from '../../assets/commonPages/logo.png';
import otpPicture from '../../assets/auth/otp.avif'
// import { otpAction } from '../../redux/store/actions/auth/OtpAction';
import { useEffect, useState } from 'react';
// import { RootState } from '../../redux/store';
// import { useAppDispatch } from '../../hooks/Hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { Response } from '../../types/IForm';
import { CLIENT_API } from '../../utilities/axios/Axios';

const OtpResetPassword = () => {
  // const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userRole] = useState(location.state.role)
//   const { error, data} = useSelector((state:RootState)=>state.auth)
  const [email]=useState(location.state?.email || localStorage.getItem('forgotPasswordEmail') || "")
  // console.log('email',email)
  const RESEND_TIME =30;
  const [timeLeft, setTimeLeft] =useState(0);
  const [canResend, setCanResend] =useState(false)

  useEffect(()=>{
    if(!email){
      toast.error('Email is missing! Redirecting to signup')
      navigate('/signup')
    }else{
      // localStorage.setItem('forgotPasswordEmail',email)
    }
  },[email,navigate])

  useEffect(()=>{
    const expiryTime = localStorage.getItem('otpExpiryTime');
    const currentTime = Math.floor(Date.now()/1000);

    if(expiryTime && Number(expiryTime)>currentTime){
      setTimeLeft(Number(expiryTime)-currentTime);
      setCanResend(false)
    }else{
      setCanResend(true)
    }
  },[])

  useEffect(()=>{
    if(timeLeft>0){
      setCanResend(false);
      const timer = setInterval(() => {
        setTimeLeft((prev)=>{
          if(prev<=1){
            clearInterval(timer);
            setCanResend(true)
            return 0
          }
          return prev-1
        })
      }, 1000);
      return ()=> clearInterval(timer)
    }
  },[timeLeft])

  const resendOtp = async()=>{

    if(!email){
      toast.error('Email is missing! Please signup again.')
      navigate('/forgotPass',{state:{role: userRole}})
      return
    }

    try {
      const response = await CLIENT_API.post('/resendOtp',{email})
      if (response.data.success) {
        toast.success("OTP resent successfully!");

        const newExpiryTime = Math.floor(Date.now()/1000)+ RESEND_TIME;
        localStorage.setItem('otpExpiryTime', String(newExpiryTime));
        setTimeLeft(RESEND_TIME);
        setCanResend(false)
        toast.error('resend otp after 30 sec')
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error('Resend OTP error:',error)
    }
  }

  
  const handleVerifyOtp = async(e: React.FormEvent) =>{
    e.preventDefault();
    setIsLoading(true)

    if(!otp){
      toast.error('Invalid OTP! Please enter a 6 digit number.')
      return 
    }
    if(!/^\d{6}$/.test(otp)){
      toast.error('Invalid OTP! Please enter a 6-digit number.')
      setIsLoading(false)
      return
    }

    if(otp && email){
         try {
          // const result = await dispatch(otpAction({ otp, email }));
          // const payload =  result.payload as Response;
          // console.log('payload',payload)
          // if (!payload?.success) {
          //   setIsLoading(false);

          //   if (payload?.message) {
          //     toast.error(payload.message);
          //   }

          // } 
          //   setIsLoading(false);
          //   navigate("/resetPass",{state:{role:userRole,email:email}});
          
          const response = await CLIENT_API.post('/verifyForgotPasswordOtp', { otp, email });
          console.log('OTP Verification Response:', response.data);
  
          if (response.data.success) {
            console.log('Navigating to /resetPass');
            navigate('/resetPass', { state: { role: userRole, email: email, isForgotPassword: true } });
          } else {
            toast.error(response.data.message || 'Invalid OTP');
          }
          setIsLoading(false);
         } catch (error) {
          console.error("OTP verification failed", error);
          toast.error("An error occurred during OTP verification.");
          setIsLoading(false);
         }
      }
  }

  useEffect(() => {
    return () => {
      // localStorage.removeItem("forgotPasswordEmail");
      localStorage.removeItem("otpExpiryTime");
    };
  }, []);
  
  return (
    <div className="h-screen flex flex-col md:flex-row bg-white">
        <div className="lg:w-1/2 relative w-full h-screen flex flex-col items-center justify-center bg-white-100">
      <div className='absolute top-4 left-4'>
      <img src={logo} alt="logo" className='w-auto h-16' />
      </div>
        <img src={otpPicture} alt="signup" className="w-11/12 h-3/4 lg:w-[600px] object-cover" />
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center bg-white-100">
      <div className="w-3/4 lg:w-[400px] bg-gray-50 p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-green-700 text-center mb-6">Verify OTP for forgot password</h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            Enter the OTP sent to your registered email/phone number. 
          </p>
          <form className="flex flex-col" onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              className="mb-6 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-center"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
            />
            <button
              type="submit"
              className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              { isLoading? 'verifying otp...':'Verify'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p>{ timeLeft>0 ? `Resend OTP in ${timeLeft} seconds`:"You can now resend OTP"} </p>
            <span className="text-sm text-gray-600">
              Didn't receive an OTP?{' '}
              <button onClick={resendOtp} disabled={!canResend} className="text-blue-600 hover:underline">
              Resend OTP
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtpResetPassword