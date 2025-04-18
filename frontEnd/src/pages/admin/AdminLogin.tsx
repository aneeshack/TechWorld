import { useFormik } from "formik"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import LeftLogin from "../../components/signup/AdminLoginLeft"
import { adminLoginSchema } from "../../utilities/validation/AdminLogin"
import { Response, Role } from "../../types/IForm"
import { useAppDispatch } from "../../hooks/Hooks"
import { loginAction } from "../../redux/store/actions/auth/LoginAction"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            role: Role.Admin,
        },
        validationSchema: adminLoginSchema,
        onSubmit: async (values) => {
            try {
                const loginResult = await dispatch(loginAction({ ...values, role: Role.Admin }))
                const payload = loginResult.payload as Response;

                if (!payload?.success) {
                    if (payload.message) {
                        toast.error(payload.message || 'Login failed.')
                    }
                } else {
                    toast.success('Login successful')
                    navigate('/admin/dashboard')
                }
            } catch (error) {
                console.error('admin login error', error)
            }
        }
    })

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left component - Hidden on extra small screens */}
            {/* <div className="hidden sm:block sm:w-full md:w-1/2"> */}
                <LeftLogin />
            {/* </div> */}

            {/* Right login container */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white py-8 px-4">
                <div className="w-full max-w-md bg-gray-200 p-6 sm:p-8 rounded-xl shadow-md">
                    <h1 className="text-xl sm:text-2xl font-bold text-green-700 text-center mb-8 sm:mb-12">
                        Admin Login
                    </h1>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <FontAwesomeIcon 
                                icon={faEnvelope}
                                className="absolute left-4 top-4 text-gray-400" 
                            />
                            <input
                                type="email"
                                {...formik.getFieldProps('email')}
                                placeholder="Enter your Email"
                                className="mb-2 p-3 w-full pl-14 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm mb-2">
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
                                className="mb-2 p-3 w-full pl-14 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                className="absolute right-3 top-4 cursor-pointer text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-sm mb-2">
                                    {formik.errors.password}
                                </div>
                            ) : null}
                        </div>


                        <button
                            type="submit"
                            className="w-full font-bold bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
                        >
                            LOGIN
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default AdminLogin;