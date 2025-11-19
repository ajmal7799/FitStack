import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";


type OTPModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResend: () => void;
};

const OTPModal = ({ isOpen, onClose, onVerify, onResend }: OTPModalProps) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [canResend, setCanResend] = useState(false);


  useEffect(() => {
    if (!isOpen) return;

    setOtp(Array(6).fill(""));
    const interval = startTimer();

    return () => clearInterval(interval);
  }, [isOpen]);

  const startTimer = () => {
    setCanResend(false);
    setTimeLeft(60);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return interval;
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };


  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("").slice(0, 6);
    const newOtp = [...otp];
    digits.forEach((digit, idx) => (newOtp[idx] = digit));
    setOtp(newOtp);

    // focus last filled input
    const nextIndex = digits.length < 6 ? digits.length : 5;
    const input = document.getElementById(`otp-input-${nextIndex}`);
    input?.focus();
  };

  const handleVerifyClick = () => {
    const otpString = otp.join("");
    if (otpString.length === 6) onVerify(otpString);
  };

  const handleResendClick = () => {
    onResend();
    startTimer();
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <motion.h2
                className="mb-2 text-2xl font-bold text-gray-900"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Enter OTP
              </motion.h2>
              <motion.p
                className="text-gray-600"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                We've sent a 6-digit OTP to your email. Please enter it below.
              </motion.p>
            </div>

            {/* OTP Inputs */}
            <motion.div className="mb-6 flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="
    h-14 w-12
    rounded-md border-2 border-gray-300
    focus:border-indigo-500
    outline-none
    text-center text-2xl font-bold text-gray-800
    transition-colors duration-150
    bg-white shadow-sm
  "
                  autoFocus={index === 0}
                />
              ))}
            </motion.div>

            {/* Timer & Resend */}
            <motion.div className="mb-4 text-center">
              <p className="text-sm text-gray-500">Time left: {formatTime(timeLeft)}</p>
              <button
                className={`
    mt-2 px-4 py-2
    text-indigo-600 font-semibold
    hover:underline
    transition-opacity duration-150
    rounded
    ${!canResend ? "opacity-50 cursor-not-allowed" : ""}
  `}
                onClick={handleResendClick}
                disabled={!canResend}
              >
                Resend OTP
              </button>
            </motion.div>

            {/* Verify Button */}
            <motion.div>
              <button
                className={`
                             w-full py-3
                 bg-indigo-600
    text-white font-semibold
    rounded-md
    hover:bg-indigo-700
    transition-colors duration-150
    shadow
    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
    ${otp.join("").length !== 6 || timeLeft <= 0 ? "opacity-50 cursor-not-allowed" : ""}
  `}
                onClick={handleVerifyClick}
                disabled={otp.join("").length !== 6 || timeLeft <= 0}
              >
                Verify
              </button>

            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(OTPModal);