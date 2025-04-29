import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import logo from '../../assets/commonPages/logo.png';
import { useAppDispatch } from "../../hooks/Hooks";
import { logoutAction } from "../../redux/store/actions/auth/LogoutAction";
import { Response } from "../../types/IForm";
import { toast } from "react-toastify";
import { MenuIcon, MessageCircle, MessageSquare, User, XIcon } from "lucide-react";
import { useSocket } from "../../context/Sockets";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import placeholder from '../../assets/commonPages/placeHolder.png';

const InstructorSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [name, setName] = useState('');
  const user = useSelector((state: RootState) => state.auth.data);

  useEffect(() => {
    setName(user?.userName || '');
  }, [user?.userName]);

  // checking for new messages or notifications
  useEffect(() => {
    if (!socket) return;

    // Listen for incoming notifications
    socket.on("receiveNotification", (notification) => {
      console.log("New notification received:", notification);
      setHasNewMessage(true);
      toast.info("New message received!");
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, [socket]);
    
  const handleLogout = async() => {
    try {
      const result = await dispatch(logoutAction());
      const response = result.payload as Response;
      
      if(!response?.success) {
        if(response.message) {
          toast.error(response.message);
        }
      } else {
        navigate('/');
      }
            
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
 
  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-indigo-600 p-2 rounded-lg text-white shadow-lg hover:bg-indigo-700 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      <div
        ref={sidebarRef}
        className={`w-20 lg:w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white h-screen fixed lg:static transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col shadow-xl`}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-center py-6 bg-indigo-800">
          <img 
            src={logo} 
            alt="Logo" 
            className={`h-12 w-auto ${!isOpen }`}
          />
          <span className={`text-xl font-bold hidden lg:block ml-2 text-white`}>TechWorld</span>
        </div>

        {/* Profile Section */}
        <div className="px-3 py-6 border-b border-indigo-400/30">
            <Link to='/'>
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="relative">
              <img 
                src={user?.profile?.avatar ?? placeholder}
                alt="Profile" 
                className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            </div>
            <div className="hidden lg:block">
              <p className="text-white font-semibold text-lg">{name}</p>
              <p className="text-indigo-200 text-sm">Instructor</p>
            </div>
          </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 lg:px-4 py-6 overflow-y-auto">
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/instructor/dashboard"
                end  
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-indigo-700 shadow-md" 
                      : "bg-indigo-800/30 text-white hover:bg-indigo-600/50"
                  }`
                }
              >
                <ChartBarIcon className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructor/dashboard/courses"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-indigo-700 shadow-md" 
                      : "bg-indigo-800/30 text-white hover:bg-indigo-600/50"
                  }`
                }
              >
                <UserGroupIcon className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Courses</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructor/dashboard/chat"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-indigo-700 shadow-md" 
                      : "bg-indigo-800/30 text-white hover:bg-indigo-600/50"
                  }`
                }
                onClick={() => setHasNewMessage(false)}
              >
                <div className="relative">
                  <MessageCircle className="h-5 w-5" />
                  {hasNewMessage && (
                    <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
                  )}
                </div>
                <span className="hidden lg:inline font-medium">Messages</span>
                {hasNewMessage && (
                  <span className="hidden lg:flex bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                    New
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructor/dashboard/profile"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-indigo-700 shadow-md" 
                      : "bg-indigo-800/30 text-white hover:bg-indigo-600/50"
                  }`
                }
              >
                <User className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructor/dashboard/forums"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-indigo-700 shadow-md" 
                      : "bg-indigo-800/30 text-white hover:bg-indigo-600/50"
                  }`
                }
              >
                <MessageSquare className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Forums</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="p-4 mt-auto border-t border-indigo-400/30">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white transition-all"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="hidden lg:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default InstructorSidebar;