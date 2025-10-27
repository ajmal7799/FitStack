import { Link,useNavigate } from "react-router-dom";
import SignupForm, { type SignupFormValues } from "../../components/auth/signUpForm";
import toast from "react-hot-toast";
import { useState } from "react";
import type { SignupPayload } from "../../types/AuthPayloads";
import OTPModal from "../../components/modals/OtpModal";
import { useUserSignup, useUserVerifyOtp } from "../../hooks/AuthHooks";

export default function UserSignUpPage() {

    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const [userData, setUserData] = useState<SignupPayload>({ name: "", email: "", password: "", phone: "" })
    const { mutate: signup } = useUserSignup();
    const { mutate: verifyOtp } = useUserVerifyOtp()
    const navigate = useNavigate();

    const handleUserSignup = (values: SignupFormValues) => {
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone
        }

        signup(payload, {
            onSuccess: (res:any) => {
               toast.success("Signup successful! Please verify OTP.");
                setUserData(payload)
                if (res.message === "Otp sent successfully") {
                    setOtpModalOpen(true)
                }
            },
            onError: (err) => {
                toast.error("Signup failed. Try again.");
                console.log("Signup error:", err);
                // toast.error((err as Error).message || "Something went wrong!");
            },
        })
    }
    const handleVerifyOtp = (otp: string) => {
        console.log(userData)
        verifyOtp(
            { otp, values: userData },
            {
                onSuccess: (res:any) => {
                    if (res.success) {
                        toast.success("OTP verified successfully!");
                        console.log("Otp verified succesfully , :", res.data);
                        setOtpModalOpen(false);
                    }
                    navigate('/home')

                }, onError: (err:any) => {
                    toast.error("Invalid OTP. Try again.");
                    console.error("Error while verifying otp ", err);
                }
            }
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
                    <p className="text-gray-500 mt-2">
                        Sign up to get started with our awesome platform
                    </p>
                </div>

                {/* Signup Form */}
                <SignupForm onSubmit={handleUserSignup} />

                {/* <OTPModal isOpen={isOtpModalOpen} onClose={() => setOtpModalOpen(false)} onVerify={handleVerifyModal} /> */}
                <OTPModal isOpen={isOtpModalOpen} onClose={() => setOtpModalOpen(false)} onVerify={handleVerifyOtp} />

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
