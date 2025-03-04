import { Route, Routes } from "react-router-dom"
import StudentDashboard from "../pages/student/StudentDashboard"
import StudentHome from "../pages/student/StudentHome"
import StudentCourses from "../pages/student/StudentCourses"
import StudentProfile from "../pages/student/StudentProfile"
import PurchaseHistory from "../pages/student/PurchaseHistory"


const StudentRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path="dashboard/*" element={<StudentDashboard/>}>


              <Route index element={<StudentHome/>}/>
              <Route path="courses" element={<StudentCourses/>}/>
              <Route path="profile" element={<StudentProfile/>}/>
              <Route path="purchase" element={<PurchaseHistory/>}/>


            <Route />
            </Route>
        </Routes>
    </div>
  )
}

export default StudentRoutes