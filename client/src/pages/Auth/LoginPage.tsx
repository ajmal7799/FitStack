import LoginForm, { type LoginFormData } from '../../components/auth/loginForm';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUserLogin,useGoogleLoginMutation } from '../../hooks/Auth/AuthHooks';
import { useDispatch } from 'react-redux';
import { setData } from '../../redux/slice/userSlice/authDataSlice';
import userLoginImg from '../../assets/userLogin.jpg';
import { useGoogleLogin } from '@react-oauth/google';

const UserLoginPage = () => {
  const { mutate: logins } = useUserLogin();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: googleLoginMutate } = useGoogleLoginMutation();
  const handleUserLogin = (values: LoginFormData) => { 
    console.log('Login values:', values); 

    logins(values, {
      onSuccess: (res: any) => {
        const user = res.data.user;
        
        dispatch(
          setData({
            name: res.data.user.name,
            email: res.data.user.email,
            phone: res.data.user.phone,
            isActive: res.data.user.isActive,
            role: res.data.user.role,
            updatedAt: res.data.user.updatedAt,
            accessToken: res.data.accessToken,
            verificationCheck: res.data.user.verificationCheck,
            userProfileCompleted: res.data.user.userProfileCompleted,
            hasActiveSubscription: res.data.user.hasActiveSubscription,
            
          })
        );

        if (user.role === 'trainer') {
          if (user.verificationCheck === true) {
            navigate('/trainer/dashboard');
          } else {
            navigate('/trainer/verification');
          }
        } else {
          navigate('/home');
        }

        toast.success(res.message);
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message || 'Invalid email and password'
        );
        console.log('Error while login,', err);
      },
    });
  };


  const login = useGoogleLogin({
    onSuccess: (res:any) => handleGoogleLoginSuccess(res.code),
    onError: (err:any) => console.log(err),
    flow: 'auth-code',
  });

  const handleGoogleLoginSuccess = (code: string) => {
    const role = 'user';
    googleLoginMutate(
      { authorizationCode: code, role },
      {
        onSuccess: (res:any) => {
          if (res.data?.user.role !== role) {
            toast.error(`You are not a ${role}`);
            return;
          }
          toast.success(res.message);
          
          dispatch(
            setData({
              // _id: res.data.user._id,
              name: res.data.user.name,
              email: res.data.user.email,
              phone: res.data.user.phone,
              role: res.data.user.role,
              isActive: res.data.user.status,
              accessToken: res.data.accessToken,
              verificationCheck: res.data.user.verificationCheck,
              userProfileCompleted: res.data.user.userProfileCompleted,
              hasActiveSubscription: res.data.user.hasActiveSubscription,
            })
          );
          if (res.data.user.role === 'trainer') {
          if (res.data.user.verificationCheck === true) {
            navigate('/trainer/dashboard');
          } else {
            navigate('/trainer/verification');
          }
        } else {
          navigate('/home');
        }
          // dispatch(setToken(res.data?.accessToken || ""));

        },
        onError: (err) => {
          toast.error('Google login failed');
          console.error(err);
        },
      }
    );
  };




  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-10 rounded-2xl shadow-xl shadow-xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Welcome Back
            </h2>

            <LoginForm onSubmit={handleUserLogin} />
            <button
              onClick={() => login()}
              type="button"
              className="w-full mt-4 x-4 py-2 border flex gap-2 bg-white hover:bg-gray-50  border-slate-200  rounded-lg text-slate-700  hover:border-slate-300  hover:text-slate-900  hover:shadow transition duration-150"
            >
              <img
                className="w-6 h-6"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              ></img>
                Login
            </button>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-full font-medium hover:bg-gray-200 transition"
              >
                Back to Home
              </button>
            </div>

            <p className="text-center text-gray-600 mt-8 text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>

            <div className="mt-4 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src={userLoginImg}
          alt="Login visual"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Optional overlay for better text readability if needed in future */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
    </div>
  );
};

export default UserLoginPage;
