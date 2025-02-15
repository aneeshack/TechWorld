import { useSelector } from 'react-redux'
import logo from '../../assets/commonPages/logo.png'
import { RootState } from '../../redux/store';
import placeholder from '../../assets/commonPages/placeHolder.png'
import {  useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/Hooks';
import { logoutAction } from '../../redux/store/actions/auth/LogoutAction';
import { useNavigate } from 'react-router-dom';
import { RequestStatus, Response } from '../../types/IForm';
import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [ isOpen, setIsOpen ] = useState(false);
  const user = useSelector((state:RootState)=>state.auth.data);
  const [userData, setUserData] = useState(user);

  useEffect(()=>{
    setUserData(user)
  },[user])

  const toggleDropDown = ()=>{
    setIsOpen((prev)=>!prev)
  }
  

  const handleDashboard = async()=>{
    try {
      if(user?.role=== 'student'){
        navigate('/student/dashboard')
      }else if(user?.role === 'instructor'){
        console.log("Request Status:", user?.requestStatus);
          switch( user?.requestStatus){
            case RequestStatus.Pending:
              toast.warning("Your application is being processed.", {
                style: { backgroundColor: "#f1c40f", color: "#000" }, // yellow
              });
              break;
            case RequestStatus.Rejected:
              toast.error("Your application has been rejected.", {
                style: { backgroundColor: "#e74c3c", color: "#fff" }, // Red
              });
              break;
            case RequestStatus.Approved:
              toast.success("Approved! Redirecting...", {
                style: { backgroundColor: "#2ecc71", color: "#fff" }, // Green
              });
              navigate('/instructor/dashboard')
              break;
            default:
              toast.info("Please register to continue.", {
                style: { backgroundColor: "#f39c12", color: "#fff" }, // Orange
              });
              navigate('/instructor/register')
          }
      }
    } catch (error) {
      console.log('error',error)
    }
  }

  const handleLogout = async()=> {
    try {
      const result = await dispatch(logoutAction())
      const response = result.payload as Response;

      if(!response?.success){
        if(response.message){
          toast.error(response.message)
        }
      }else{
        navigate('/')
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogin =()=>{
    navigate('/login',{state: {role:'student'}})
  }
  const handleSignup =()=>{
    navigate('/signup',{state: {role:'student'}})
  }

  return (
    <div>
        <nav className="bg-white border-b py-4">
  <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
    <div className="relative flex h-16 items-center justify-between">
   
      <div className="flex items-center justify-start mr-10">
        <img className="h-16 w-auto" src={logo} alt="Your Company" />
      </div>

      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">

        <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">
            <a href="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Home</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Courses</a>
            <a href="/teachUs" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Teach Us</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Instructors</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50  hover:bg-green-700 hover:text-white">Contact Us</a>
          </div>
        </div>
      </div>

      { (userData?.role === 'instructor' || userData?.role === 'student')? (
        <div className='relative z-50 cursor-pointer'>
        <div className='flex items-center gap-2 p-2 border border-gray-300 rounded-lg shadow-md cursor-pointer' onClick={toggleDropDown}>
          <img src={placeholder} alt="Profile" 
          className='w-12 h-12 '/>
          <p className='text-gray-900 font-semibold'>{ userData.userName?.toUpperCase() }</p>
        </div>
        {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
          {userData.role === 'instructor' && (userData.requestStatus !==RequestStatus.Pending && userData.requestStatus !==RequestStatus.Rejected && userData.requestStatus !==RequestStatus.Approved )?
        <button 
        className="w-full px-4 py-2 text-left hover:bg-gray-200"
        onClick={handleDashboard}
      >
        Update Profile
      </button>:
      <button 
      className="w-full px-4 py-2 text-left hover:bg-gray-200"
      onClick={handleDashboard}
    >
      Dashboard
    </button>  
        }
          {/* <button 
            className="w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={handleDashboard}
          >
            Dashboard
          </button> */}
          <button 
            className="w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
        </div>
     
      ):(
      <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        {/* <a href="/signup?role=student" onClick={handleSignup} className="rounded-md hidden sm:block bg-green-900 px-3 py-2 mr-3 text-sm font-medium text-white" aria-current="page">Signup</a> */}
        <a href="" onClick={handleSignup} className="rounded-md hidden sm:block bg-green-900 px-3 py-2 mr-3 text-sm font-medium text-white" aria-current="page">Signup</a>
        <a href="" onClick={handleLogin} className="rounded-md hidden sm:block bg-green-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Login</a>
      </div>
      )}
        

    </div>
    
  </div>
  <div className="sm:hidden" id="mobile-menu">
    <div className="space-y-1 px-2 pb-3 pt-2">
      {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
      <a href="/" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" aria-current="page">Home</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Courses</a>
      <a href="/teachUs" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Teach Us</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Instructors</a>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar