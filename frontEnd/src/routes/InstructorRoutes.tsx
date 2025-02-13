import { Route, Routes } from "react-router-dom"
import InstructorDashboard from "../pages/instructor/InstructorDashboard"


const InstructorRoutes = () => {

  return (
    <div>
        <Routes>
      
        <Route path="dashboard" element={<InstructorDashboard/>}/>
        </Routes>    
    </div>
  )
}

export default InstructorRoutes