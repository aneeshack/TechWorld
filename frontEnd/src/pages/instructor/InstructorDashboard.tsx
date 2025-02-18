import FooterDashboard from "../../components/common/FooterDashboard"
import NavbarDashboard from "../../components/common/NavbarDashboard"
import InstructorSidebar from "../../components/instructor/InstructorSidebar"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const InstructorDashboard = () => {

  
  const navigate = useNavigate();
  const user = useSelector((state:RootState)=>state.auth.data)
  console.log('role',user?.role)

  useEffect(()=>{
    if( !user || user?.role !=='instructor'){
      console.log('role',user?.role)
      navigate('/')
    }
  },[user,navigate])
  
  return (
    <div className="w-full flex h-screen">
      <InstructorSidebar/>
      <div className="w-4/5 flex flex-col min-h-screen">
      <NavbarDashboard/>
      <div className="flex-grow flex justify-center items-start overflow-auto ">
          {/* Future content will be placed here */}
          {/* <p className="text-xl text-gray-700"> Instructor Main Content Here</p> */}
          <Outlet/>
        </div>
      <FooterDashboard/>
      </div>
    </div>
  )
}

export default InstructorDashboard