import { useSelector } from 'react-redux'
import logo from '../../assets/commonPages/logo.png'
import { RootState } from '../../redux/store';
import placeholder from '../../assets/commonPages/placeHolder.png'
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/Hooks';
import { logoutAction } from '../../redux/store/actions/auth/LogoutAction';
import { NavLink, useNavigate } from 'react-router-dom';
import { RequestStatus, Response, Role, SignupFormData } from '../../types/IForm';
import { toast } from 'react-toastify';
import { Menu, X, ChevronDown, User, LogOut, Home, BookOpen, Briefcase } from 'lucide-react';
import { useSocket } from '../../context/Sockets';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.data);
  const [userData, setUserData] = useState<SignupFormData | null>(user);
  const socket = useSocket()

  useEffect(() => {
    setUserData(user)
  }, [user])

  const toggleDropDown = () => {
    setIsOpen((prev) => !prev)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  }

  const handleDashboard = async () => {
    try {
      if (user?.role === Role.Student) {
        navigate('/student/dashboard')
      } else if (user?.role === Role.Instructor) {
        switch (user?.requestStatus) {
          case RequestStatus.Pending:
            toast.warning("Your application is being processed.", {
              style: { backgroundColor: "#f1c40f", color: "#000" },
            });
            break;
          case RequestStatus.Rejected:
            toast.error("Your application has been rejected.", {
              style: { backgroundColor: "#e74c3c", color: "#fff" },
            });
            break;
          case RequestStatus.Approved:
            toast.success("Approved! Redirecting...", {
              style: { backgroundColor: "#2ecc71", color: "#fff" },
            });
            navigate('/instructor/dashboard')
            break;
          default:
            toast.info("Please register to continue.", {
              style: { backgroundColor: "#f39c12", color: "#fff" },
            });
            navigate('/instructor/register')
        }
      }else if (user?.role === Role.Admin) {
        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  const handleLogout = async () => {
    try {
      if (socket) {
        socket.emit("leave_room", user?._id);
        socket.disconnect(); 
      }
      const result = await dispatch(logoutAction())
      const response = result.payload as Response;

      if (!response?.success) {
        if (response.message) {
          toast.error(response.message)
        }
      } else {
        navigate('/')
      }
      // Close dropdown after logout
      setIsOpen(false);
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = () => {
    navigate('/login', { state: { role: 'student' } })
  }
  
  const handleSignup = () => {
    navigate('/signup', { state: { role: 'student' } })
  }

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={16} /> },
    { path: '/courseList', label: 'Courses', icon: <BookOpen size={16} /> },
    { path: '/teachUs', label: 'Teach Us', icon: <Briefcase size={16} /> },
    // { path: '/instructors', label: 'Instructors', icon: <Users size={16} /> },
    // { path: '/contactUs', label: 'Contact Us', icon: <Mail size={16} /> }
  ];

  // Function to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.user-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="sticky top-0 z-50 shadow-md">
      <nav className="bg-white border-b ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-700 hover:bg-gray-100 focus:outline-none"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/">
                <img className="h-12 w-auto" src={logo} alt="Learn Hub" />
              </NavLink>
            </div>

            {/* Desktop menu */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-green-700 text-white"
                        : "text-gray-600 hover:bg-green-600 hover:text-white"
                    }`
                  }
                >
                  <span className="hidden lg:inline-block">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* User profile or login buttons */}
            <div className="flex items-center">
              {(userData?.role === Role.Instructor|| userData?.role === Role.Student ||userData?.role===Role.Admin) ? (
                <div className="relative user-dropdown">
                  <div
                    className="flex items-center gap-2  border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={toggleDropDown}
                  >
                    <img
                      src={ userData?.profile?.avatar ?? placeholder}
                      // src={avatarUrl} 
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-gray-800 font-medium hidden sm:block">
                      {userData.userName?.slice(0, 15)}
                    </span>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{userData.userName}</p>
                      </div>

                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                        onClick={handleDashboard}
                      >
                        <User size={16} />
                        {userData.role === 'instructor' && 
                        (userData.requestStatus !== RequestStatus.Pending && 
                         userData.requestStatus !== RequestStatus.Rejected && 
                         userData.requestStatus !== RequestStatus.Approved)
                          ? 'Update Profile'
                          : 'Dashboard'
                        }
                      </button>

                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSignup}
                    className="rounded-md hidden sm:block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={handleLogin}
                    className="rounded-md hidden sm:block bg-green-700 hover:bg-green-800 px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white border-t border-gray-200 animate-slideDown`}>
          <div className="space-y-1 px-2 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium ${
                    isActive
                      ? "bg-green-700 text-white"
                      : "text-gray-600 hover:bg-green-100"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            
            {/* Mobile sign up/login buttons */}
            {!userData && (
              <div className="pt-4 pb-1 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-3">
                  <button
                    onClick={handleSignup}
                    className="w-full text-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={handleLogin}
                    className="w-full text-center py-2 px-4 border border-transparent rounded-md text-white bg-green-700 hover:bg-green-800"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;