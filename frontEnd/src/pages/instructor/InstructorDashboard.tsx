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
    <div className="flex h-screen w-full overflow-hidden">
      <InstructorSidebar/>
      <div className="flex-1 flex flex-col min-h-screen">
      {/* <NavbarDashboard/> */}
      <div className="flex-1 overflow-y-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboard