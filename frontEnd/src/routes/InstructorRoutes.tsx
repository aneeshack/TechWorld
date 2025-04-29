import { Route, Routes } from "react-router-dom"
import InstructorDashboard from "../pages/instructor/InstructorDashboard"
import InstructorHome from "../pages/instructor/InstructorHome"
import InstructorCourses from "../pages/instructor/InstructorCourses"
import InstructorProfile from "../pages/instructor/InstructorProfile"
import CreateCourse from "../pages/instructor/CreateCourse"
import AddLesson from "../pages/instructor/AddLesson"
import LessonsList from "../pages/instructor/LessonsList"
import Assessment from "../pages/instructor/Assessment"
import EditAssessment from "../pages/instructor/EditAssessment"
import ChatPage from "../pages/commonPages/ChatPage"
import ErrorPage from "../pages/commonPages/ErrorPage"
import DiscussionForum from "../pages/commonPages/DiscussionForum"
import InstructorForum from "../pages/instructor/InstructorForum"
import FinalAssessment from "../pages/instructor/FinalAssessment"
import EditFinalAssessment from "../pages/instructor/EditFinalAssessment"


const InstructorRoutes = () => {

  return (
    <div>
        <Routes>
      
        <Route path="dashboard/*" element={<InstructorDashboard/>}>
        
        <Route index element={<InstructorHome/>}/>
        <Route path="courses" element={<InstructorCourses/>}/>
        <Route path="courses/:courseId/finalAssessment" element={<FinalAssessment/>}/>
        <Route path="editFinalAssessment/:courseId" element={<EditFinalAssessment/>}/>

        <Route path="profile" element={<InstructorProfile/>}/>

        <Route path="createCourse" element={<CreateCourse/>}/>
        <Route path="editCourse/:courseId" element={<CreateCourse/>}/>
        <Route path="lesson/:courseId/add" element={<AddLesson/>}/>
        <Route path="editLesson/:courseId/:lessonId" element={<AddLesson/>}/>
        <Route path="lessons/:courseId" element={<LessonsList/>}/>
        <Route path="addAssessment/:lessonId" element={<Assessment/>}/>
        <Route path="editAssessment/:lessonId" element={<EditAssessment/>}/>
        <Route path="chat" element={<ChatPage/>}/>
        
        <Route path="forum/:courseId" element={<DiscussionForum/>}/>
        <Route path="forums" element={<InstructorForum/>}/>

        
        <Route path="*" element={<ErrorPage />} />
        </Route>
        </Routes>    
    </div>
  )
}

export default InstructorRoutes