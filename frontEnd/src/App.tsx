import { Route, Routes } from "react-router-dom"
import UserRoutes from "./routes/UserRoutes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000}/>
    <Routes>
      <Route path='/*' element={<UserRoutes/>}/>
    </Routes>
    </>
  )
}

export default App