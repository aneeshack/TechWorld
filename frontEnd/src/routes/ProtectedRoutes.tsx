import React from "react";
import { Role } from "../types/IForm";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";

interface ProtectedRouteProps{
    allowedRole: Role;
    redirectPath?: string;
}


const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({
    allowedRole,
    redirectPath = '/login',
}) => {

    const user = useSelector((state:RootState)=>state.auth.data);

    if(!user){
        // toast.warning("Login before checkout", { autoClose: 2000 }); 
        toast.warn("Please log in before checkout!", {
            position: "top-center", // ✅ This toast appears in center
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
          });
        return <Navigate to={redirectPath} state={{role:allowedRole}} replace />
    }

    if(user.role !==allowedRole){
        toast.error("You are not authorized to access this page", { autoClose: 2000 }); 
        return <Navigate to={redirectPath} state={{role:allowedRole}} replace />
    }
  return <Outlet/>
}

export default ProtectedRoutes