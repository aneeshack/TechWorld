import { useEffect, useState } from "react";
import google from "../../assets/auth/google.jpeg";
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
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [heading, setHeading] = useState("Student Signup");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();


  const role = location.state?.role
  const { loading } = useSelector((state: RootState) => state.auth);
  console.log('state',location.state)
  useEffect(() => {
    if (role === Role.Instructor) {
      setHeading("Instructor Signup");
    } else if (role === Role.Student){
      setHeading("Student Signup");
    }
  }, [role]);


  const handleChange = ()=>{
    navigate('/login',{state:{role:role}})
  }
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: role as Role,
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const data = { ...values, role: values.role as Role };
        const signupResult = await dispatch(signupAction({ ...data }));
        const payload = signupResult.payload as Response;

        if (!payload?.success) {
          setIsLoading(false);
          
          if (payload?.message) {
            toast.error(payload.message);
          }
          
        } else {
          setIsLoading(false);
          navigate("/otp", { state: { email: values.email } });
        }
      } catch (error) {
        console.error("signup error", error);
      }
    },
  });

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white">
      <LeftSection />

      {/* Right Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center bg-white-100">
        <div className="w-3/4 h-sull sm:h-full lg:w-[500px] md:h-5/6 bg-gray-200 p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-green-700 text-center mb-[20px]">
            <p>{loading ? "Loading..." : ""}</p>
            {heading}
          </h1>

          <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-4 top-4 text-gray-400"
              />
              <input
                type="text"
                {...formik.getFieldProps("userName")}
                placeholder="Enter username"
                className="mb-4 p-3 w-full pl-14 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {formik.touched.userName && formik.errors.userName ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.userName}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-4 top-4 text-gray-400"
              />
              <input
                type="email"
                {...formik.getFieldProps("email")}
                placeholder="Enter your Email"
                className="mb-4 p-3 w-full pl-14 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-4 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
                placeholder="Enter the Password"
                className="mb-6 p-3 w-full pl-14 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-4 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-4 text-gray-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...formik.getFieldProps("confirmPassword")}
                placeholder="Confirm Password"
                className="mb-6 p-3 w-full pl-14 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-4 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              {isLoading ? "SIGNUP....." : "SIGNUP"}
            </button>
          </form>

          <div className="flex items-center justify-center mt-4">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-sm text-gray-600 mx-2">OR</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          <button
            type="button"
            className="flex items-center justify-center w-full mt-4 bg-white text-gray-700 border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition duration-300"
          >
            <img src={google} alt="Google Icon" className="w-5 h-5 mr-3" />
            Sign Up with Google
          </button>

          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="" onClick={handleChange} className="text-blue-600 hover:underline">
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
