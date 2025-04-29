import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { BookOpenIcon, ArrowLeftOnRectangleIcon, ChartBarIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/commonPages/logo.png";
import { useAppDispatch } from "../../hooks/Hooks";
import { logoutAction } from "../../redux/store/actions/auth/LogoutAction";
import { Response } from "../../types/IForm";
import { toast } from "react-toastify";
import { CreditCard, MenuIcon, MessageCircle, MessageSquare, User, XIcon } from "lucide-react";
import { useSocket } from "../../context/Sockets";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import placeholder from '../../assets/commonPages/placeHolder.png';

const StudentSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const user = useSelector((state: RootState) => state.auth.data);
  const [name, setName] = useState('');

  useEffect(() => {
    setName(user?.userName || '');
  }, [user?.userName]);

  // checking for new messages or notifications
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveNotification", (notification) => {
      console.log("New notification received:", notification);
      setHasNewMessage(true);
      toast.info("New message received!");
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, [socket]);

  const handleLogout = async () => {
    try {
      if (socket) {
        socket.emit("leave_room", user?._id);
        socket.disconnect();
      }
      const result = await dispatch(logoutAction());
      const response = result.payload as Response;
      if (!response?.success) {
        if (response.message) {
          toast.error(response.message);
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // sidebar open and close
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
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-700 p-2 rounded-full shadow-lg text-white hover:bg-blue-800 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      <div
        ref={sidebarRef}
        className={`w-16 md:w-16 lg:w-64 bg-gradient-to-b from-blue-700 to-blue-800 h-screen fixed lg:static transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col shadow-xl`}
      >
        {/* Logo Section */}
        <div className="flex h-[80px] lg:h-[100px] items-center justify-center py-4 lg:py-6 bg-blue-800 shadow-inner">
          <img src={logo} alt="Logo" className="h-10 lg:h-12 w-auto drop-shadow-md" />
        </div>

        {/* Profile Section - Only visible on large screens */}
        <div className="hidden lg:flex justify-center items-center py-4 bg-blue-900/30 border-b border-blue-600/30">
          <Link to='/' className="w-full">
            <div className="mx-auto flex items-center w-[85%] gap-3 px-2 py-3 bg-white/10 rounded-lg backdrop-blur-sm shadow-lg hover:bg-white/15 transition-all duration-300">
              <img 
                src={user?.profile?.avatar ?? placeholder}
                alt="Profile" 
                className="w-12 h-12 rounded-full border-2 border-blue-400 object-cover shadow-md" 
              />
              <div className="flex-1">
                <p className="text-white font-semibold truncate">{name}</p>
                <p className="text-blue-200 text-xs">Student</p>
              </div>
              <div className="relative">
                {hasNewMessage && (
                  <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Compact Profile for Small/Medium Screens */}
        <div className="flex lg:hidden justify-center items-center py-3 bg-blue-900/30 border-b border-blue-600/30">
          <Link to='/' className="relative">
            <img 
              src={user?.profile?.avatar ?? placeholder}
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover shadow-md" 
            />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
            )}
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-2 lg:px-4 py-4 lg:py-6 overflow-y-auto">
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/student/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-md" 
                      : "bg-blue-800/30 text-white hover:bg-blue-600/50"
                  }`
                }
              >
                <ChartBarIcon className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/dashboard/profile"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-md" 
                      : "bg-blue-800/30 text-white hover:bg-blue-600/50"
                  }`
                }
              >
                <User className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/dashboard/chat"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-md" 
                      : "bg-blue-800/30 text-white hover:bg-blue-600/50"
                  }`
                }
                onClick={() => setHasNewMessage(false)}
              >
                <div className="relative">
                  <MessageCircle className="h-5 w-5" />
                  {hasNewMessage && (
                    <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full lg:hidden"></span>
                  )}
                </div>
                <span className="hidden lg:inline font-medium">Messages</span>
                {hasNewMessage && (
                  <span className="hidden lg:inline bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                    New
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/dashboard/certificates"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-md" 
                      : "bg-blue-800/30 text-white hover:bg-blue-600/50"
                  }`
                }
              >
                <AcademicCapIcon  className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Courses</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/dashboard/courses"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-md" 
                      : "bg-blue-800/30 text-white hover:bg-blue-600/50"
                  }`
                }
              >
                <BookOpenIcon className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Courses</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/dashboard/forums"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-md" 
                      : "bg-blue-800/30 text-white hover:bg-blue-600/50"
                  }`
                }
              >
                <MessageSquare className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Forums</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/dashboard/purchase"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-md" 
                      : "bg-blue-800/30 text-white hover:bg-blue-600/50"
                  }`
                }
              >
                <CreditCard className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Payment</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Footer Section - Pinned to Bottom */}
        <div className="mt-auto p-2 lg:p-4 border-t border-blue-600/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-white transition-all duration-300"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-300" />
            <span className="hidden lg:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;