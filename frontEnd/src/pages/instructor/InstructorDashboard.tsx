import FooterDashboard from "../../components/common/FooterDashboard"
import NavbarDashboard from "../../components/common/NavbarDashboard"
import InstructorSidebar from "../../components/instructor/InstructorSidebar"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const InstructorDashboard = () => {

  
  const navigate = useNavigate();
  const user = useSelector((state:RootState)=>state.auth.data)

  useEffect(()=>{
    if( !user || user?.role !=='instructor'){
      navigate('/')
    }
  },[user,navigate])
  return (
    <div className="w-full flex align-middle">
      <InstructorSidebar/>
      <div className="w-4/5 flex flex-col ">
      <NavbarDashboard/>
      <div className="flex-grow flex justify-center items-center">
          {/* Future content will be placed here */}
          <p className="text-xl text-gray-700"> Instructor Main Content Here</p>
        </div>
      <FooterDashboard/>
      </div>
    </div>
  )
}

export default InstructorDashboard