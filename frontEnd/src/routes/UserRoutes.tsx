import { Navigate, Outlet, Route, Routes } from "react-router-dom"
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
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import ErrorPage from "../pages/commonPages/ErrorPage"

const PublicRoute = () => {
  const user = useSelector((state: RootState) => state.auth.data);
  
  if (user) {
   
        return <Navigate to="/" replace />;
  }
  return <Outlet />; // Render public route if not authenticated
};
const UserRoutes = () => {
  return (
    <div>
        <Routes>
          {/* Home page accessible to all */}
            <Route path="/" element={<Home/>}/>
            
          {/* authentication paths */}
          <Route element={<PublicRoute/>}>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/otp" element={<Otp/>}/>
            <Route path="/resetPassOtp" element={<OtpResetPassword/>}/>
            <Route path="/forgotPass" element={<ForgotPassword/>}/>
            <Route path="/resetPass" element={<ResetPassword/>}/>
          </Route>


            {/* common pages */}
            <Route path="/teachUs" element={<TeachUs/>}/>
            <Route path="/courseList" element={<CourseList/>}/>
            <Route path="/courseDetail/:courseId" element={<DistinctCourses/>}/>

            {/* protected checkout route */}
            <Route element={<ProtectedRoutes allowedRole={Role.Student} />}>
              <Route path="/checkout/:courseId" element={<Checkout/>}/>
              <Route path="/payment-success" element={<PaymentSuccess/>}/>
            </Route>
            <Route path="*" element={<ErrorPage />} />

        </Routes>
    </div>
  )
}

export default UserRoutes