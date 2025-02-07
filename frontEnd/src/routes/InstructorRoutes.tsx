import { Route, Routes } from "react-router-dom"
import Registration from "../pages/instructor/Registration"
import InstructorDashboard from "../pages/instructor/InstructorDashboard"

const InstructorRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path="register" element={<Registration/>}/>
            <Route path="dashboard" element={<InstructorDashboard/>}/>
        </Routes>
    </div>
  )
}

export default InstructorRoutes