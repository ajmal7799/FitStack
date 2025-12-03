import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SignupForm, { type SignupFormValues } from "../../components/auth/signUpForm";
import toast from "react-hot-toast";
import { useState } from "react";
import type { SignupPayload } from "../../types/AuthPayloads";
import OTPModal from "../../components/modals/OtpModal";
import { useUserSignup, useUserVerifyOtp, useUserResendOtp, useGoogleLoginMutation } from "../../hooks/Auth/AuthHooks";
import { useDispatch } from "react-redux";
import { setData } from "../../redux/slice/userSlice/authDataSlice";
import SignupImg from "../../assets/SignupImg.jpg";
import { useGoogleLogin } from "@react-oauth/google";

export default function UserSignUpPage() {

    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const [userData, setUserData] = useState<SignupPayload>({ name: "", email: "", password: "", phone: "" })
    const { mutate: signup } = useUserSignup();
    const { mutate: verifyOtp } = useUserVerifyOtp() 
    const { mutate: resendOtp } = useUserResendOtp();
    const { mutate: googleLoginMutate } = useGoogleLoginMutation();
 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'user';

    const handleUserSignup = (values: SignupFormValues) => {
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            role: role
        }

        signup(payload, {
            onSuccess: (res: any) => {
                toast.success("Signup successful! Please verify OTP.");
                setUserData(payload)
                if (res.message === "Otp sent successfully") {
                    setOtpModalOpen(true)
                }
            },
            onError: (err: any) => {
                toast.error(err.response.data.message)
            },
        })
    }

    const handleVerifyOtp = (otp: string) => {
        verifyOtp(
            { otp, values: userData },
            {
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("OTP verified successfully!");
                        setOtpModalOpen(false);

                        dispatch(setData({
                            name: res.data.user.name,
                            email: res.data.user.email,
                            phone: res.data.user.phone,
                            isActive: res.data.user.isActive,
                            role: res.data.user.role,
                            updatedAt: res.data.user.updatedAt,
                            accessToken: res.data.accessToken,
                            verificationCheck: res.data.accessToken,
                        }));

                        if (userData.role === "trainer") {
                            navigate("/trainer/verification");
                        } else {
                            navigate("/home")
                        }
                    }
                },
                onError: (err: any) => {
                    toast.error(err.response.data.message)
                }
            }
        )
    }

    const handleResendOtp = (email: string) => {
        resendOtp(email, {
            onSuccess: () => toast.success("OTP Resent successfully"),
            onError: () => toast.error("Failed to resend OTP"),
        });
    };

    const googleSignup = useGoogleLogin({
        onSuccess: (res: any) => handleGoogleSignupSuccess(res.code),
        onError: (err: any) => console.log(err),
        flow: "auth-code",
    });

    const handleGoogleSignupSuccess = (code: string) => {
        googleLoginMutate(
            { authorizationCode: code, role },
            {
                onSuccess: (res: any) => {
                    if (res.data?.user.role !== role) {
                        toast.error(`You have already account as ${res.data?.user.role}. If you want to continue please use another gmail`);
                        return;
                    }
                    toast.success(res.message);
                    
                    dispatch(
                        setData({
                            name: res.data.user.name,
                            email: res.data.user.email,
                            phone: res.data.user.phone,
                            role: res.data.user.role,
                            isActive: res.data.user.status,
                            accessToken: res.data.accessToken,
                            verificationCheck: res.data.user.verificationCheck
                        })
                    );

                    if (res.data.user.role === "trainer") {
                        if (res.data.user.verificationCheck) {
                            navigate("/trainer/dashboard");
                        } else {
                            navigate("/trainer/verification");
                        }
                    } else {
                        navigate("/home");
                    }
                },
                onError: (err) => {
                    toast.error("Google signup failed");
                    console.error(err);
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Half – Form */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Create Your {role.charAt(0).toUpperCase() + role.slice(1)} Account
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Sign up to get started as a {role}
                        </p>
                    </div>

                    <SignupForm onSubmit={handleUserSignup} />

                    {/* Google Signup Button */}
                    <button
                        onClick={() => googleSignup()}
                        type="button"
                        className="w-full mt-4 px-4 py-2 border flex gap-2 bg-white hover:bg-gray-50 border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 hover:text-slate-900 hover:shadow transition duration-150"
                    >
                        <img
                            className="w-6 h-6"
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            loading="lazy"
                            alt="google logo"
                        />
                        <span>Sign up with Google</span>
                    </button>

                    <div className="flex justify-center my-4">
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-2 bg-gray-200 text-gray-500 rounded-full text-base font-medium shadow-none border-0 hover:bg-gray-300 transition"
                        >
                            Back to Home
                        </button>
                    </div>

                    <p className="text-center text-gray-500 mt-6 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Half – Image Only */}
            <div className="hidden lg:block flex-1 relative overflow-hidden">
                <img
                    src={SignupImg}
                    alt="Signup"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* OTP Modal */}
            <OTPModal
                isOpen={isOtpModalOpen}
                onClose={() => setOtpModalOpen(false)}
                onVerify={handleVerifyOtp}
                onResend={() => handleResendOtp(userData.email)}
            />
        </div>
    )
}