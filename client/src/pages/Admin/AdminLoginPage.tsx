import adminLoginImg from "../../assets/adminLoginImg.jpg"
import { useAdminLogin } from "../../hooks/Auth/Admin/AdminAuthHooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { LoginPayload } from '../../types/AuthPayloads';
import toast from 'react-hot-toast';
import { setData } from '../../redux/slice/userSlice/authDataSlice';
// import  { AxiosError } from 'axios'; 
import LoginForm from '../../components/auth/loginForm';

const AdminLoginPage = () => {
  const { mutate: login } = useAdminLogin()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAdminLogin = (values: LoginPayload) => {
    login(values, {
      onSuccess: (res: any) => {
        toast.success("Login Successful");
        dispatch(
          setData({
            name: res.data.user.name,
            email: res.data.user.email,
            phone: res.data.user.phone,
            isActive: res.data.user.isActive,
            role: res.data.user.role,
            updatedAt: res.data.user.updatedAt,  
            accessToken: res.data.accessToken,
            verificationCheck: res.data.user.verificationCheck
          })
        );
        navigate("/admin/dashboard")
      },

      onError: (err: any) => {
        toast.error(err.response.data.message);
        console.log("Error while login ,", err)
      }
    })

  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Form */}
          <LoginForm onSubmit={handleAdminLogin} />

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Fitstack. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block md:w-1/2 h-[100vh] overflow-hidden rounded-r-2xl.5">
        <img
          src={adminLoginImg}
          alt="Admin login"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  )

}


export default AdminLoginPage