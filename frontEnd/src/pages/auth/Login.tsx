import LeftSection from "../../components/signup/LeftSection";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Response, Role } from "../../types/IForm";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { loginValidationSchema } from "../../utilities/validation/LoginSchema";
import { useAppDispatch } from "../../hooks/Hooks";
import { loginAction } from "../../redux/store/actions/auth/LoginAction";
import { toast } from "react-toastify";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { googleAuthAction } from "../../redux/store/actions/auth/GoogleAuthAction";
import { useSocket } from "../../context/Sockets";

const Login = () => {
  const [heading, setHeading] = useState("Student Login");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(location.state?.role);
  const socket = useSocket();

  useEffect(() => {
    if (userRole) {
      setUserRole(userRole);
    }
    localStorage.removeItem("forgotPasswordEmail");
  }, [userRole]);

  useEffect(() => {
    console.log('user role',userRole)
    if (!userRole) {
      navigate("/");
      // toast.error("Please login through home page.");
    } else {
      localStorage.removeItem("forgotPasswordEmail");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    if (userRole === Role.Instructor) {
      setHeading("Instructor Login");
    } else if (userRole === Role.Student) {
      setHeading("Student Login");
    }
  }, [userRole]);

  const handleChange = () => {
    navigate("/signup", { state: { role: userRole } });
  };

  const handleForgotPassword = () => {
    navigate("/forgotPass", { state: { role: userRole } });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: userRole,
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const data = { ...values };
        const loginResult = await dispatch(loginAction({ ...data, role: userRole }));
        const payload = loginResult.payload as Response;
        if (!payload?.success) {
          if (payload.message) {
            toast.error(payload.message || "Login failed. Please try again.");
          }
          return;
        }

        if (socket) {
          const userId = payload.data?._id;
          if (!userId) {
            console.error("User ID not found in login payload");
            return;
          }

          if (socket.connected) {
            socket.emit("join_room", userId);
            console.log(`App: Joined room for user ${userId} after login`);
          } else {
            console.log("App: Socket not connected, forcing connection after login");
            socket.connect();

            socket.on("connect", () => {
              socket.emit("join_room", userId);
              console.log(`App: Joined room for user ${userId} after socket connected`);
            });

            socket.on("connect_error", (error) => {
              console.error("App: Socket connection error after login:", error.message);
            });
          }
        }
        toast.success("Login successful");
        navigate("/");
      } catch (error) {
        console.error("Login error", error);
      }
    },
  });

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const googleLogin = await dispatch(googleAuthAction({ credentials: credentialResponse, userRole }));
      const payload = googleLogin.payload as Response;

      if (!payload?.success) {
        if (payload.message) {
          toast.error(payload.message || "Login failed. Please try again.");
        }
      } else {
        if (socket) {
          const userId = payload.data?._id;
          if (!userId) {
            console.error("User ID not found in login payload");
            return;
          }

          if (socket.connected) {
            socket.emit("join_room", userId);
            console.log(`App: Joined room for user ${userId} after Google login`);
          } else {
            console.log("App: Socket not connected, forcing connection after Google login");
            socket.connect();

            socket.on("connect", () => {
              socket.emit("join_room", userId);
              console.log(`App: Joined room for user ${userId} after socket connect`);
            });

            socket.on("connect_error", (error) => {
              console.error("App: Socket connection error after Google login:", error.message);
            });
          }
        }
        toast.success("Login successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error("Google login failed");
    console.error("Google login error");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
        <LeftSection />
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md bg-gray-200 p-6 sm:p-8 rounded-xl shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold text-green-700 text-center mb-8 sm:mb-12">
            {heading}
          </h1>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-4 top-3.5 text-gray-400"
              />
              <input
                type="email"
                {...formik.getFieldProps("email")}
                placeholder="Enter your Email"
                className="p-3 pl-12 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-sm text-red-500 mt-1">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-3.5 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
                placeholder="Enter the Password"
                className="p-3 pl-12 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-sm text-red-500 mt-1">{formik.errors.password}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300 text-sm sm:text-base"
            >
              LOGIN
            </button>
          </form>
          <div className="text-center mt-4">
            <a
              href="#"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <div className="flex items-center justify-center mt-5">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-sm text-gray-600 mx-2">OR</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          <div className="mt-5">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
          </div>

          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              Are you a new User?{" "}
              <a
                href=""
                onClick={handleChange}
                className="text-blue-600 hover:underline"
              >
                Signup
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
