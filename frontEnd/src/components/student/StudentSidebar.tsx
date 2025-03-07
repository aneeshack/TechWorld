import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BookOpenIcon, ArrowLeftOnRectangleIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/commonPages/logo.png";
import { useAppDispatch } from "../../hooks/Hooks";
import { logoutAction } from "../../redux/store/actions/auth/LogoutAction";
import { Response } from "../../types/IForm";
import { toast } from "react-toastify";
import { CreditCard, MenuIcon, MessageCircle, User, XIcon } from "lucide-react";

const StudentSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
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
      console.log(error);
    }
  };

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
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-700 p-2 rounded-lg text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      <div
        ref={sidebarRef}
        className={`w-64 bg-[#A7D7C5] text-black h-screen fixed lg:static transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}
      >
        {/* Header Section */}
        <div className="flex h-[100px] items-center justify-center py-6">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/student/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group ${
                    isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"
                  }`
                }
              >
                <ChartBarIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
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
                to="/student/dashboard/chat"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 hover:text-white hover:bg-green-800 bg-transparent transition-colors group"
              >
                <MessageCircle className="h-6 w-6 text-green-300 group-hover:text-white" />
                <span className="font-medium hover:text-white">Messages</span>
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
                className="flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 hover:text-white hover:bg-green-800 bg-transparent transition-colors group"
              >
                <CreditCard className="h-6 w-6 text-green-300 group-hover:text-white" />
                <span className="font-medium">Payment</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Footer Section - Pinned to Bottom */}
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="w-full border border-green-600 flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-800 transition-colors group"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;