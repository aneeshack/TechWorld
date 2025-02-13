import { Navigate, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
// import { toast, ToastContainer } from "react-toastify"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstructorRoutes from "./routes/InstructorRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/Hooks";
import { fetchUserAction } from "./redux/store/actions/auth/fetchUserAction";
import { logoutAction } from "./redux/store/actions/auth/LogoutAction";
import { RequestStatus, Role } from "./types/IForm";
import AdminLogin from "./pages/admin/AdminLogin";
import Registration from "./pages/instructor/Registration";

const App = () => {
  const user = useSelector((state: RootState) => state.auth.data);
  const dispatch = useAppDispatch();


  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        await dispatch(fetchUserAction());
      } else if (user?.isBlocked) {
        dispatch(logoutAction());
        toast.error("Techworld team blocked your account! Please contact us");
      }
    };
    fetchUser()
  }, [user, dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route
          path="/student/*"
          element={
            user?.role === Role.Student ? (
              <StudentRoutes />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/instructor/register"
          element={
            user?.role === Role.Instructor && !user?.isRequested ? (
              <Registration />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/instructor/*"
          element={
            user?.role === Role.Instructor ? (
              user?.requestStatus === RequestStatus.Approved ? (
                <InstructorRoutes />
              ) : (  <>

                <Navigate to="/" />
              </>
                // <Navigate to="/" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Admin login is seperated from normal user login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/*"
          element={
            user?.role === Role.Admin ? (
              <AdminRoutes />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
