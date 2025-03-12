import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  // HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  // Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import logo from '../../assets/commonPages/logo.png';
import { useAppDispatch } from "../../hooks/Hooks";
import { logoutAction } from "../../redux/store/actions/auth/LogoutAction";
import { toast } from "react-toastify";
import { Response } from "../../types/IForm";

const AdminSidebar: React.FC = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

    const handleLogout = async()=> {
      try {
        const result = await dispatch(logoutAction())
        const response = result.payload as Response;
  
        if(!response?.success){
          if(response.message){
            toast.error(response.message)
          }
        }else{
          navigate('/admin/login')
        }
        
      } catch (error) {
        console.log(error)
      }
    }
  
  return (
    <div className="w-1/5 hidden md:flex md:flex-col 	bg-[#A7D7C5] text-black h-screen mr-10">
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
              to="/admin/dashboard"
              end  
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
                ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
              }
            >
              <ChartBarIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
              <span className="font-medium">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/dashboard/users"
               className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
                ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
              }
            >
              <UserGroupIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
              <span className="font-medium hover:text-white">Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/dashboard/requests"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
                ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
              }
            >
              <UserGroupIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
              <span className="font-medium hover:text-white">Instructor Requests</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/dashboard/categories"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
                ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
              }
            >
              <BookOpenIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
              <span className="font-medium hover:text-white">Categories</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
                ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
              }
            >
              <Cog6ToothIcon className="h-6 w-6 text-green-300  group-hover:text-white" />
              <span className="font-medium ">Settings</span>
            </NavLink>
          </li> */}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4" >
        <button onClick={handleLogout} className="w-full border border-green-600 flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-800 transition-colors group">
          <ArrowLeftOnRectangleIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
          <span className="font-medium" >Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;