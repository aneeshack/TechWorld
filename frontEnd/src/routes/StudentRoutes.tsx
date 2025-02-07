import { Route, Routes } from "react-router-dom"
import StudentDashboard from "../pages/student/StudentDashboard"


const StudentRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path="dashboard" element={<StudentDashboard/>}/>
        </Routes>
    </div>
  )
}

export default StudentRoutes