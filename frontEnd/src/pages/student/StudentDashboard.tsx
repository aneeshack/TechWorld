import FooterDashboard from "../../components/common/FooterDashboard"
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
    <div className="w-full flex h-screen">
      <StudentSidebar/>
      <div className="w-4/5 flex flex-col min-h-screen">
      <NavbarDashboard/>
      <div className="flex-grow flex justify-center items-center overflow-auto ">
          {/* Future content will be placed here */}
          {/* <p className="text-xl text-gray-700">Student Main Content Here</p> */}
          <Outlet/>
        </div>
      <FooterDashboard/>
      </div>
    </div>
  )
}

export default StudentDashboard