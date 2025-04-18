import { useEffect, useState } from "react";
import LeftSection from "../../components/signup/LeftSection";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/Hooks";
import { useFormik } from "formik";
import { signupAction } from "../../redux/store/actions/auth/SignupAction";
import { Response, Role } from "../../types/IForm";
import { signupValidationSchema } from "../../utilities/validation/SingupSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { googleAuthAction } from "../../redux/store/actions/auth/GoogleAuthAction";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [heading, setHeading] = useState("Student Signup");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [userRole, setUserRole] = useState(location.state?.role);

  useEffect(() => {
    console.log('userr role in signup',userRole)
    if (userRole) {
      setUserRole(userRole);
    } else {
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    if (userRole === Role.Instructor) {
      setHeading("Instructor Signup");
    } else if (userRole === Role.Student) {
      setHeading("Student Signup");
    }
  }, [userRole]);

  const handleChange = () => {
    console.log('inside direct to login')
    navigate("/login", { state: { role: userRole } });
  };

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: userRole,
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const data = { ...values, role: userRole };
        const signupResult = await dispatch(signupAction({ ...data }));
        const payload = signupResult.payload as Response;

        if (!payload?.success) {
          setIsLoading(false);
          if (payload?.message) {
            toast.error(payload.message);
          }
        } else {
          setIsLoading(false);
          localStorage.setItem("signupEmail", values.email);
          const newExpiryTime = Math.floor(Date.now() / 1000) + 30;
          localStorage.setItem("otpExpiryTime", String(newExpiryTime));
          navigate("/otp", { state: { email: values.email } });
        }
      } catch (error) {
        console.error("Signup error", error);
      }
    },
  });

  const handleGoogleSignupSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const googleSignup = await dispatch(googleAuthAction({ credentials: credentialResponse, userRole }));
      const payload = googleSignup.payload as Response;

      if (!payload?.success) {
        if (payload.message) {
          toast.error(payload.message || "Signup failed. Please try again.");
        }
      } else {
        toast.success("Signup successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Google signup failed");
    }
  };

  const handleGoogleSignupFailure = () => {
    toast.error("Google signup failed");
    console.error("Google signup error");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
        <LeftSection />
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md bg-gray-200 p-6 sm:p-8 rounded-xl shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold text-green-700 text-center mb-6 sm:mb-8">
            {heading}
          </h1>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-4 top-3.5 text-gray-400"
              />
              <input
                type="text"
                {...formik.getFieldProps("userName")}
                placeholder="Enter username"
                className="p-3 pl-12 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
              />
              {formik.touched.userName && formik.errors.userName ? (
                <div className="text-sm text-red-500 mt-1">{formik.errors.userName}</div>
              ) : null}
            </div>

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

            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-3.5 text-gray-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...formik.getFieldProps("confirmPassword")}
                placeholder="Confirm Password"
                className="p-3 pl-12 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-sm text-red-500 mt-1">{formik.errors.confirmPassword}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "SIGNUP..." : "SIGNUP"}
            </button>
          </form>

          <div className="flex items-center justify-center mt-5">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-sm text-gray-600 mx-2">OR</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          <div className="mt-5">
            <GoogleLogin
              onSuccess={handleGoogleSignupSuccess}
              onError={handleGoogleSignupFailure}
            />
          </div>

          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href=""
                onClick={handleChange}
                className="text-blue-600 hover:underline"
              >
                Login
              </a>
            </span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Signup;
