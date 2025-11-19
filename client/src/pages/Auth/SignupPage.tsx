import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SignupForm, { type SignupFormValues } from "../../components/auth/signUpForm";
import toast from "react-hot-toast";
import { useState } from "react";
import type { SignupPayload } from "../../types/AuthPayloads";
import OTPModal from "../../components/modals/OtpModal";
import { useUserSignup, useUserVerifyOtp, useUserResendOtp } from "../../hooks/AuthHooks";
import { useDispatch } from "react-redux";
import { setData } from "../../redux/slice/userSlice/authDataSlice";
// import { AxiosError } from "axios"

export default function UserSignUpPage() {

    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const [userData, setUserData] = useState<SignupPayload>({ name: "", email: "", password: "", phone: "" })
    const { mutate: signup } = useUserSignup();
    const { mutate: verifyOtp } = useUserVerifyOtp()
    const { mutate: resendOtp } = useUserResendOtp();

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
        // console.log(userData)
        verifyOtp(
            { otp, values: userData },
            {
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("OTP verified successfully!");
                        console.log("Otp verified succesfully , :", res.data);
                        setOtpModalOpen(false);


                        dispatch(setData({
                            name: res.data.user.name,
                            email: res.data.user.email,
                            phone: res.data.user.phone,
                            isActive: res.data.user.isActive,
                            role: res.data.user.role,
                            updatedAt: res.data.user.updatedAt,
                            accessToken: res.data.accessToken,
                        }));


                        if (userData.role === "trainer") {
                            navigate("/trainer/home")
                        } else {
                            navigate("/home")
                        }
                    }


                }, onError: (err: any) => {
                    // if (err instanceof Error) {
                    toast.error(err.response.data.message)
                    // }
                }
            }
        )
    }

     const handleResendOtp = (email: string) => {
    console.log("Sending resend OTP...",email);
    resendOtp(email, {
      onSuccess: (res) => {
        console.log("response from resend otp :", res);
        toast.success("OTP Resent successfully");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Failed to resend OTP");
      },
    });
  };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Create Your {role.charAt(0).toUpperCase() + role.slice(1)} Account
                    </h1>
                    
                    <p className="text-gray-500 mt-2">
                        Sign up to get started as a {role}
                    </p>
                </div>

                {/* Signup Form */}
                <SignupForm onSubmit={handleUserSignup} />

                {/* <OTPModal isOpen={isOtpModalOpen} onClose={() => setOtpModalOpen(false)} onVerify={handleVerifyModal} /> */}
                <OTPModal isOpen={isOtpModalOpen} onClose={() => setOtpModalOpen(false)} onVerify={handleVerifyOtp} onResend={() => handleResendOtp(userData.email)} />
        {/* Back to Home Button */}
        
<div className="flex justify-center my-4">
  <button
    onClick={() => navigate("/")}
    className="
      px-6 py-2
      bg-gray-200
      text-gray-500
      rounded-full
      text-base
      font-medium
      shadow-none
      border-0
      hover:bg-gray-300
      transition
    "
  >
    Back to Home
  </button>
</div>

                {/* Footer / Login Link */}
                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )

}
