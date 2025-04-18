import NavbarDashboard from "../../components/common/NavbarDashboard"
import StudentSidebar from "../../components/student/StudentSidebar"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const StudentDashboard = () => {

  const navigate = useNavigate();
  const user = useSelector((state:RootState)=>state.auth.data)

  useEffect(()=>{
    if( !user || user?.role !=='student'){
      navigate('/')
    }
  },[user,navigate])
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <StudentSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <NavbarDashboard />
        <div className="flex-1 overflow-y-auto pt-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard