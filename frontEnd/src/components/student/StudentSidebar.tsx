import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  // HomeIcon,
  BookOpenIcon,
  // Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import logo from '../../assets/commonPages/logo.png';
import { useAppDispatch } from "../../hooks/Hooks";
import { logoutAction } from "../../redux/store/actions/auth/LogoutAction";
import { Response } from "../../types/IForm";
import { toast } from "react-toastify";
import { CreditCard, User } from "lucide-react";


const StudentSidebar: React.FC = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async()=>{
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
  

  return (
    <div className="w-1/5 hidden	bg-[#A7D7C5] text-black h-screen md:flex md:flex-col">
      {/* Logo Section */}
      <div className="flex h-[100px] items-center  justify-center py-6 ">
        <img 
          src={logo} 
          alt="Logo" 
          className="h-12 w-auto"
        />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/student/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
                ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
              }
            >
              <ChartBarIcon className="h-6 w-6 text-green-300  group-hover:text-white" />
              <span className="font-medium hover:text-white">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/dashboard/profile"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 hover:text-white hover:bg-green-800 bg-transparent transition-colors group"
            >
              <User className="h-6 w-6 text-green-300 group-hover:text-white" />
              <span className="font-medium hover:text-white">Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/dashboard/courses"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 hover:text-white hover:bg-green-800 bg-transparent transition-colors group"
            >
              <BookOpenIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
              <span className="font-medium hover:text-white">Courses</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/dashboard/purchase"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg border hover:text-white border-green-600 hover:bg-green-800 bg-transparent transition-colors group"
            >
              <CreditCard className="h-6 w-6 text-green-300  group-hover:text-white" />
              <span className="font-medium ">Payment</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4" >
        <button onClick={handleLogout} className="w-full border border-green-600 flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-800 transition-colors group">
          <ArrowLeftOnRectangleIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;