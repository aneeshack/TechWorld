// import React, { useEffect, useRef, useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { 
//   BookOpenIcon,
//   UserGroupIcon,
//   ArrowLeftOnRectangleIcon,
//   ChartBarIcon,
// } from "@heroicons/react/24/outline";
// import logo from '../../assets/commonPages/logo.png';
// import { useAppDispatch } from "../../hooks/Hooks";
// import { logoutAction } from "../../redux/store/actions/auth/LogoutAction";
// import { toast } from "react-toastify";
// import { Response } from "../../types/IForm";
// import { MenuIcon, XIcon } from "lucide-react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import placeholder from '../../assets/commonPages/placeHolder.png';

// const AdminSidebar: React.FC = () => {

//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const user = useSelector((state:RootState)=>state.auth.data)
//   const [name,setName]= useState('')

//     useEffect(()=>{
//       setName(user?.userName|| '')
//     },[user?.userName])
  
//     const handleLogout = async()=> {
//       try {
//         const result = await dispatch(logoutAction())
//         const response = result.payload as Response;
  
//         if(!response?.success){
//           if(response.message){
//             toast.error(response.message)
//           }
//         }else{
//           navigate('/admin/login')
//         }
        
//       } catch (error) {
//         console.error(error)
//       }
//     }
  
//     // sidebar open and close
//       useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//           if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
//             setIsOpen(false);
//           }
//         };
//         if (isOpen) {
//           document.addEventListener("mousedown", handleClickOutside);
//         } else {
//           document.removeEventListener("mousedown", handleClickOutside);
//         }
//         return () => {
//           document.removeEventListener("mousedown", handleClickOutside);
//         };
//       }, [isOpen]);

//   return (
//     <>
//     <button
//       className="lg:hidden fixed top-4 left-4 z-50 bg-green-700 p-2 rounded-lg text-white"
//       onClick={() => setIsOpen(!isOpen)}
//     >
//       {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
//     </button>

//     <div
//       ref={sidebarRef}
//       className={`w-64 bg-[#A7D7C5] text-black h-screen fixed lg:static transform ${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}
//     >
//       {/* Logo Section */}
//       <div className="flex h-[100px] items-center  justify-center py-6 ">
//         <img 
//           src={logo} 
//           alt="Logo" 
//           className="h-12 w-auto"
//         />
//       </div>

//       {/* Navigation Items */}
//       <nav className="flex-1 px-4 py-6">
//       <div className="relative z-50 cursor-pointer pr-8">
//          <div className="h-[65px] flex items-center w-[200px] gap-4 px-2 py-3 border border-gray-300 rounded-lg shadow-md cursor-pointer">
//           <img 
//           src={ user?.profile?.avatar ?? placeholder}
//           alt="Profile" className="w-14 h-14 rounded-full" />
//           <p className="text-gray-900 font-semibold">{name}</p>
//       </div>
//         </div>
//         <ul className="space-y-2">
//           <li>
//             <NavLink
//               to="/admin/dashboard"
//               end  
//               className={({ isActive }) =>
//                 `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
//                 ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
//               }
//             >
//               <ChartBarIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
//               <span className="font-medium">Dashboard</span>
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/admin/dashboard/users"
//                className={({ isActive }) =>
//                 `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
//                 ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
//               }
//             >
//               <UserGroupIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
//               <span className="font-medium hover:text-white">Users</span>
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/admin/dashboard/requests"
//               className={({ isActive }) =>
//                 `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
//                 ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
//               }
//             >
//               <UserGroupIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
//               <span className="font-medium hover:text-white">Instructor Requests</span>
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/admin/dashboard/categories"
//               className={({ isActive }) =>
//                 `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
//                 ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
//               }
//             >
//               <BookOpenIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
//               <span className="font-medium hover:text-white">Categories</span>
//             </NavLink>
//           </li>
//           {/* <li>
//             <NavLink
//               to="/settings"
//               className={({ isActive }) =>
//                 `flex items-center space-x-3 px-4 py-3 rounded-lg border border-green-600 transition-colors group 
//                 ${isActive ? "bg-green-800 text-white" : "bg-transparent hover:bg-green-800 hover:text-white"}`
//               }
//             >
//               <Cog6ToothIcon className="h-6 w-6 text-green-300  group-hover:text-white" />
//               <span className="font-medium ">Settings</span>
//             </NavLink>
//           </li> */}
//         </ul>
//       </nav>

//       {/* Footer Section */}
//       <div className="p-4" >
//         <button onClick={handleLogout} className="w-full border border-green-600 flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-800 transition-colors group">
//           <ArrowLeftOnRectangleIcon className="h-6 w-6 text-green-300 group-hover:text-white" />
//           <span className="font-medium" >Logout</span>
//         </button>
//       </div>
//     </div>
//     </>
//   );
// };

// export default AdminSidebar;


import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import logo from '../../assets/commonPages/logo.png';
import { useAppDispatch } from "../../hooks/Hooks";
import { logoutAction } from "../../redux/store/actions/auth/LogoutAction";
import { toast } from "react-toastify";
import { Response } from "../../types/IForm";
import { MenuIcon, XIcon, Grid, User, FileText, FolderTree } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import placeholder from '../../assets/commonPages/placeHolder.png';

const AdminSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.data);
  const [name, setName] = useState('');

  useEffect(() => {
    setName(user?.userName || '');
  }, [user?.userName]);
  
  const handleLogout = async() => {
    try {
      const result = await dispatch(logoutAction());
      const response = result.payload as Response;

      if(!response?.success){
        if(response.message){
          toast.error(response.message);
        }
      } else {
        navigate('/admin/login');
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
        className="lg:hidden fixed top-4 left-4 z-50 bg-emerald-800 p-2 rounded-lg text-white shadow-lg hover:bg-emerald-700 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      <div
        ref={sidebarRef}
        className={`w-20 lg:w-64 bg-gradient-to-b from-emerald-900 to-green-900 text-white h-screen fixed lg:static transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col shadow-xl`}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-center py-6 bg-emerald-950/50">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-10 w-auto"
          />
          <span className="text-lg font-bold text-white ml-2 hidden lg:block">Admin Portal</span>
        </div>

        {/* Profile Section */}
        <Link to='/'>
        <div className="px-3 py-4 border-b border-emerald-700/50">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="relative">
              <img 
                src={user?.profile?.avatar ?? placeholder}
                alt="Profile" 
                className="w-12 h-12 rounded-full border-2 border-emerald-400 shadow-md object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-900"></div>
            </div>
            <div className="hidden lg:block text-center lg:text-left">
              <p className="text-white font-medium text-sm">{name}</p>
              <p className="text-emerald-300 text-xs">Administrator</p>
            </div>
          </div>
        </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 lg:px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-transparent">
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/admin/dashboard"
                end  
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-white text-emerald-800 shadow-md" 
                      : "bg-emerald-800/30 text-white hover:bg-emerald-700/40"
                  }`
                }
              >
                <Grid className="h-5 w-5" />
                <span className="hidden lg:block font-medium text-sm">Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/dashboard/users"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-white text-emerald-800 shadow-md" 
                      : "bg-emerald-800/30 text-white hover:bg-emerald-700/40"
                  }`
                }
              >
                <User className="h-5 w-5" />
                <span className="hidden lg:block font-medium text-sm">Users</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/dashboard/requests"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-white text-emerald-800 shadow-md" 
                      : "bg-emerald-800/30 text-white hover:bg-emerald-700/40"
                  }`
                }
              >
                <FileText className="h-5 w-5" />
                <span className="hidden lg:block font-medium text-sm">Instructor Requests</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/dashboard/categories"
                className={({ isActive }) =>
                  `flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-white text-emerald-800 shadow-md" 
                      : "bg-emerald-800/30 text-white hover:bg-emerald-700/40"
                  }`
                }
              >
                <FolderTree className="h-5 w-5" />
                <span className="hidden lg:block font-medium text-sm">Categories</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="p-3 mt-auto border-t border-emerald-700/50">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-3 lg:px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-white transition-all"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="hidden lg:block font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;