import logo from '../../assets/commonPages/logo.png';
import reset from '../../assets/auth/login.avif';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { PasswordValidationSchema } from '../../utilities/validation/PasswordSchema';
import { CLIENT_API } from '../../utilities/axios/Axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [userRole] = useState(location.state.role)
  const [isLoading, setIsLoading]= useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email]=useState(location.state?.email || localStorage.getItem('forgotPasswordEmail') || "")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  console.log(email,'email')
  console.log('user role',userRole)


  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword:'',
      role: userRole,
      email: ''
    },
    validationSchema: PasswordValidationSchema,
    onSubmit: async(values)=>{
      try {
        setIsLoading(true);
        const data = {...values, role:userRole, email:email};
        await CLIENT_API.patch('/resetPass',data)
        .then((response)=>{
          console.log(response.data)
          navigate('/login',{state:{role:userRole}})
        })
        .catch((error)=>{
          console.log('error in reset password',error)
        })
        
      } catch (error) {
        console.log('reset password error',error)
      }
    }
  })

  const handleLogin =()=>{
    navigate('/login',{state:{role:userRole}})
  }

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
          <form onSubmit={formik.handleSubmit} className="flex flex-col">

          <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-4 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
                placeholder="Enter the Password"
                className="mb-6 p-3 w-full pl-14 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-4 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-4 text-gray-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...formik.getFieldProps("confirmPassword")}
                placeholder="Confirm Password"
                className="mb-6 p-3 w-full pl-14 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-4 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              {isLoading ?'Reset Password...' :'Reset Password'} 
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
  );
};

export default ResetPassword;
