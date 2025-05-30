import { Route, Routes } from "react-router-dom"
import StudentDashboard from "../pages/student/StudentDashboard"
import StudentHome from "../pages/student/StudentHome"
import StudentCourses from "../pages/student/StudentCourses"
import StudentProfile from "../pages/student/StudentProfile"
import PurchaseHistory from "../pages/student/PurchaseHistory"
import CourseWatching from "../pages/student/CourseWatch"
import ConductAssessment from "../pages/student/ConductAssessment"
import ChatPage from "../pages/commonPages/ChatPage"
import CourseCertificate from "../pages/student/CourseCertificate"
import ErrorPage from "../pages/commonPages/ErrorPage"
import DiscussionForum from "../pages/commonPages/DiscussionForum"
import ForumsPage from "../pages/student/ForumList"
import ConductFinalExam from "../pages/student/ConductFinalExam"
// import DiscussionDetail from "../pages/commonPages/DiscussionDetail"


const StudentRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path="dashboard/*" element={<StudentDashboard/>}>


              <Route index element={<StudentHome/>}/>
              <Route path="courses" element={<StudentCourses/>}/>
              <Route path="course/:courseId" element={<CourseWatching/>}/>
              <Route path="profile" element={<StudentProfile/>}/>
              <Route path="purchase" element={<PurchaseHistory/>}/>
              <Route path="assessment/:lessonId" element={<ConductAssessment/>}/>
              <Route path="finalAssessment/:courseId" element={<ConductFinalExam/>}/>
              <Route path="chat" element={<ChatPage/>}/>
              <Route path="certificate/:courseId" element={<CourseCertificate/>}/>
              <Route path="forum/:courseId" element={<DiscussionForum/>}/>
              <Route path="forums" element={<ForumsPage/>}/>


            <Route path="*" element={<ErrorPage />} />
            </Route>
        </Routes>
    </div>
  )
}

export default StudentRoutes