import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  // HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon
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
    <div className="w-1/5 	bg-[#A7D7C5] text-black h-screen flex flex-col">
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
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 hover:bg-green-800 bg-transparent hover:text-white transition-colors group"
            >
              <ChartBarIcon className="h-6 w-6 text-green-300  group-hover:text-white" />
              <span className="font-medium hover:text-white">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/dashboard/users"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 hover:text-white hover:bg-green-800 bg-transparent transition-colors group"
            >
              <UserGroupIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
              <span className="font-medium hover:text-white">Users</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/dashboard/requests"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 hover:text-white hover:bg-green-800 bg-transparent transition-colors group"
            >
              <UserGroupIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
              <span className="font-medium hover:text-white">Instructor Requests</span>
            </Link>
          </li>
          <li>
            <Link
              to=""
              className="flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 hover:text-white hover:bg-green-800 bg-transparent transition-colors group"
            >
              <BookOpenIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
              <span className="font-medium hover:text-white">Courses</span>
            </Link>
          </li>
          <li>
            <Link
              to=""
              className="flex items-center space-x-3 px-4 py-3 rounded-lg border hover:text-white border-green-600 hover:bg-green-800 bg-transparent transition-colors group"
            >
              <Cog6ToothIcon className="h-6 w-6 text-green-300  group-hover:text-white" />
              <span className="font-medium ">Settings</span>
            </Link>
          </li>
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