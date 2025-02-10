import { Route, Routes } from "react-router-dom"
import UserRoutes from "./routes/UserRoutes"
// import { toast, ToastContainer } from "react-toastify"
import {  toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import InstructorRoutes from "./routes/InstructorRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useEffect} from "react";
import { useAppDispatch } from "./hooks/Hooks";
import { fetchUserAction } from "./redux/store/actions/auth/fetchUserAction";
import { logoutAction } from "./redux/store/actions/auth/LogoutAction";

const App = () => {
  const user = useSelector((state:RootState)=>state.auth.data)
  const dispatch = useAppDispatch();
  
  const fetchUser = async () => {
    if (!user) {
      await dispatch(fetchUserAction())

    } else if (user?.isBlocked) {
      dispatch(logoutAction());
      toast.error('Techworld team blocked your account! Please contact us');
    }
  };
  useEffect(()=>{
    if(!user){
      fetchUser();
    }

  },[user, dispatch])

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000}/>

      <Routes>
      <Route path='/*' element={<UserRoutes/>}/>
      <Route path='/student/*' element={<StudentRoutes/>}/>
      <Route path='/instructor/*' element={<InstructorRoutes/>}/>
      <Route path='/admin/*' element={<AdminRoutes/>}/>
      </Routes>
      
    </>
  )
}

export default App