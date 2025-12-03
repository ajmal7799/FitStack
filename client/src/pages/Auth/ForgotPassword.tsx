import { Link, useNavigate } from "react-router-dom";
import userLoginImg from "../../assets/userLogin.jpg";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForgotPassword, useForgetPasswordVerifyOtp, useResetPassword } from "../../hooks/Auth/AuthHooks";
import z from "zod";
import { Eye, EyeOff } from "lucide-react"; // ← Added

const EmailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const OtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "Only numbers allowed"),
});

const PasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a symbol"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Step = "email" | "otp" | "password" | "success";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const navigate = useNavigate();

  const { mutate: sendOtp, isPending: sendingOtp } = useForgotPassword();
  const { mutate: verifyOtp, isPending: verifyingOtp } = useForgetPasswordVerifyOtp();
  const { mutate: resetPassword, isPending: resetting } = useResetPassword();

  // Step 1: Send OTP
  const handleSendOtp = () => {
    const result = EmailSchema.safeParse({ email });
    if (!result.success) {
      setErrors({ email: result.error.issues[0].message });
      return;
    }
    setErrors({});

    sendOtp(email, {
      onSuccess: (res: any) => {
        toast.success(res.message || "OTP sent successfully!");
        setStep("otp");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to send OTP");
      },
    });
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = () => {
    const result = OtpSchema.safeParse({ otp });
    if (!result.success) {
      setErrors({ otp: result.error.issues[0].message });
      return;
    }
    setErrors({});

    verifyOtp(
      { email, otp },
      {
        onSuccess: (res: any) => {
          setToken(res.data);
          toast.success("OTP verified!");
          setStep("password");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Invalid OTP");
        },
      }
    );
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    const result = PasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    resetPassword(
      { email, token, password },
      {
        onSuccess: () => {
          setStep("success");
          toast.success("Password changed successfully!");
          // Navigate after a short delay so user sees success screen
          setTimeout(() => navigate("/login"), 2000);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to reset password");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {/* Dynamic Progress Bar */}
            <div className="flex justify-center mb-10">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step === "email" ? "bg-indigo-600 text-white" : "bg-green-500 text-white"}`}>
                  1
                </div>
                <div className={`w-20 h-1 transition-all ${step !== "email" ? "bg-green-500" : "bg-gray-300"}`} />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${["otp", "password", "success"].includes(step) ? (step === "otp" ? "bg-indigo-600 text-white" : "bg-green-500 text-white") : "bg-gray-300 text-gray-500"}`}>
                  2
                </div>
                <div className={`w-20 h-1 transition-all ${["password", "success"].includes(step) ? "bg-green-500" : "bg-gray-300"}`} />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step === "password" ? "bg-indigo-600 text-white" : step === "success" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"}`}>
                  3
                </div>
              </div>
            </div>

            {/* Step 1: Email */}
            {step === "email" && (
              <>
                <h2 className="text-3xl font-bold text-center text-gray-800079 mb-3">Forgot Password?</h2>
                <p className="text-center text-gray-600 mb-8">Enter your email to receive an OTP</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition">
                    {sendingOtp ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Enter OTP</h2>
                <p className="text-center text-gray-600 mb-8">
                  We sent a 6-digit code to <span className="font-semibold">{email}</span>
                </p>

                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type={showOtp ? "text" : "password"}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full text-center text-3xl tracking-widest font-mono py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showOtp ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </div>
                  {errors.otp && <p className="text-red-500 text-sm text-center -mt-4">{errors.otp}</p>}

                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    {verifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    Didn’t receive?{" "}
                    <button onClick={handleSendOtp} className="text-indigo-600 font-medium hover:underline">
                      Resend OTP
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* Step: New Password */}
            {step === "password" && (
              <>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Set New Password</h2>
                <p className="text-center text-gray-600 mb-8">Create a strong password</p>

                <div className="space-y-5">
                  {/* New Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <button
                    onClick={handleResetPassword}
                    disabled={resetting}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    {resetting ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </>
            )}

            {/* Success Step */}
            {step === "success" && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Password Reset Successful!</h2>
                <p className="text-gray-600 mb-8">You can now log in with your new password</p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Go to Login
                </button>
              </div>
            )}

            {/* Back to Login */}
            {step !== "success" && (
              <p className="mt-8 text-center text-sm text-gray-600">
                Remember password?{" "}
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                  Back to Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src={userLoginImg}
          alt="Reset password"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </div>
  );
};

export default ForgotPassword;