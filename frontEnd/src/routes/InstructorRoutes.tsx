import { Route, Routes } from "react-router-dom"
import InstructorDashboard from "../pages/instructor/InstructorDashboard"
import InstructorHome from "../pages/instructor/InstructorHome"
import InstructorCourses from "../pages/instructor/InstructorCourses"
import InstructorProfile from "../pages/instructor/InstructorProfile"
import CreateCourse from "../pages/instructor/CreateCourse"
import AddLesson from "../pages/instructor/AddLesson"
import LessonsList from "../pages/instructor/LessonsList"
import Assessment from "../pages/instructor/Assessment"


const InstructorRoutes = () => {

  return (
    <div>
        <Routes>
      
        <Route path="dashboard/*" element={<InstructorDashboard/>}>
        
        <Route index element={<InstructorHome/>}/>
        <Route path="courses" element={<InstructorCourses/>}/>
        <Route path="profile" element={<InstructorProfile/>}/>
        <Route path="createCourse" element={<CreateCourse/>}/>
        <Route path="editCourse/:courseId" element={<CreateCourse/>}/>
        {/* <Route path="addLesson" element={<AddLesson/>}/> */}
        <Route path="lesson/:courseId/add" element={<AddLesson/>}/>
        <Route path="editLesson/:courseId/:lessonId" element={<AddLesson/>}/>
        <Route path="lessons/:courseId" element={<LessonsList/>}/>
        <Route path="addAssessment" element={<Assessment/>}/>
        
        </Route>

        </Routes>    
    </div>
  )
}

export default InstructorRoutes