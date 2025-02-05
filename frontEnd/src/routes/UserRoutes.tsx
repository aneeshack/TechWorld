import { Route, Routes } from "react-router-dom"
import Home from "../pages/commonPages/Home"
import Signup from "../pages/auth/Signup"
import Login from "../pages/auth/Login"
import Otp from "../pages/auth/Otp"
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import TeachUs from "../pages/commonPages/TeachUs"


const UserRoutes = () => {
  return (
    <div>
        <Routes>
          {/* authentication paths */}
            <Route path="/" element={<Home/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/otp" element={<Otp/>}/>
            <Route path="/forgotPass" element={<ForgotPassword/>}/>
            <Route path="/resetPass" element={<ResetPassword/>}/>

            {/* common pages */}
            <Route path="/teachUs" element={<TeachUs/>}/>
        </Routes>
    </div>
  )
}

export default UserRoutes