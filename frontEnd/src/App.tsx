import { Route, Routes } from "react-router-dom"
import UserRoutes from "./routes/UserRoutes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import InstructorRoutes from "./routes/InstructorRoutes";
import StudentRoutes from "./routes/StudentRoutes";

const App = () => {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000}/>
    <Routes>
      <Route path='/*' element={<UserRoutes/>}/>
      <Route path='/student/*' element={<StudentRoutes/>}/>
      <Route path='/instructor/*' element={<InstructorRoutes/>}/>
    </Routes>
    </>
  )
}

export default App