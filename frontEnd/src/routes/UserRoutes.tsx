import { Route, Routes } from "react-router-dom"
import Home from "../pages/commonPages/Home"
import Signup from "../pages/auth/Signup"
import Login from "../pages/auth/Login"
import Otp from "../pages/auth/Otp"
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import TeachUs from "../pages/commonPages/TeachUs"
import OtpResetPassword from "../pages/auth/OtpResetPassword"
import CourseList from "../pages/commonPages/CourseList"
import DistinctCourses from "../pages/commonPages/DistinctCourses"
import Checkout from "../pages/commonPages/Checkout"
import ProtectedRoutes from "./ProtectedRoutes"
import { Role } from "../types/IForm"
import PaymentSuccess from "../pages/commonPages/PaymentSuccess"


const UserRoutes = () => {
  return (
    <div>
        <Routes>
          {/* authentication paths */}
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/otp" element={<Otp/>}/>
            <Route path="/resetPassOtp" element={<OtpResetPassword/>}/>
            <Route path="/forgotPass" element={<ForgotPassword/>}/>
            <Route path="/resetPass" element={<ResetPassword/>}/>

            {/* common pages */}
            <Route path="/teachUs" element={<TeachUs/>}/>
            <Route path="/courseList" element={<CourseList/>}/>
            <Route path="/courseDetail/:courseId" element={<DistinctCourses/>}/>

            {/* protected checkout route */}
            <Route element={<ProtectedRoutes allowedRole={Role.Student} />}>
              <Route path="/checkout/:courseId" element={<Checkout/>}/>
              <Route path="/payment-success" element={<PaymentSuccess/>}/>
            </Route>

        </Routes>
    </div>
  )
}

export default UserRoutes