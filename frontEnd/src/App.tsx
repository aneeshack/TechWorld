import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
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
import { useSocket } from "./context/Sockets";

const App = () => {
  const user = useSelector((state: RootState) => state.auth.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  console.log("user in app.tsx", user);

  
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const result = await dispatch(fetchUserAction());
        const fetchedUser = result.payload;

        if (fetchedUser?.isBlocked) {
          dispatch(logoutAction());
          toast.error("Techworld team blocked your account! Please contact us");
          navigate("/login", {
            state: { role: fetchedUser.role },
            replace: true,
          });
        }
      } else if (user.isBlocked) {
        console.log('user is blocke in app')
        dispatch(logoutAction());
        toast.error("Techworld team blocked your account! Please contact us");
        navigate("/login", { state: { role: user.role }, replace: true });
      }
    };

    fetchUser();
  }, [user, dispatch, navigate]);


  useEffect(() => {
    if (!socket || !user?._id) {
      console.log(socket,user?._id,"user in the effect ")
      return;

    }
    console.log("Joinnnnnnnnnning")

    const joinRoom = () => {
      socket.emit("join_room", user._id);
      console.log(`Joined room for user ${user._id}`);
    };

    console.log("Socket state before join:", {
      connected: socket.connected,
      id: socket.id,
    });

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
      console.log("Waiting for socket to connect");
    }

    socket.on("initial_online_users", (onlineUsersList) => {
      console.log(`Initial online users for ${user?._id}:`, onlineUsersList);
    });

    socket.on("user-blocked", () => {
      dispatch(logoutAction());
      toast.error("Techworld team blocked your account! Please contact us");
      navigate("/login", { state: { role: user.role }, replace: true });
    });

    socket.onAny((eventName, ...args) => {
    console.log(`Received event: ${eventName}`, args);
    });


    socket.on("online_status", ({ userId, isOnline }) => {
      console.log(
        `Online status update: ${userId} is ${isOnline ? "online" : "offline"}`
      );
    });

    return () => {
      socket.emit("leave_room", user._id);
      console.log(`Left room for user ${user._id}`);
      socket.off("connect", joinRoom);
      socket.off("initial_online_users");
      socket.off("online_status");
      socket.off("user-blocked")
    };
  }, [socket, user?._id]);
  
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
              ) : (
                <>
                  <Navigate to="/" />
                </>
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Admin login is seperated from normal user login */}
        <Route path="/admin/login" element={
          user?.role ===Role.Admin ?(
            <Navigate to='/admin/dashboard' replace />
          ):(
            <AdminLogin/>
          )
        } />

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
