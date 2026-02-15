import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import TrainerSidebar from "../../../components/trainer/Sidebar";
import TrainerHeader from "../../../components/trainer/Header";
import { useChangePassword } from "../../../hooks/User/userServiceHooks";


const ChangeTrainerPasswordPage = () => {
  const { mutate, isPending } = useChangePassword();


  // Visibility states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });


  const newPasswordValue = watch("newPassword");


  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          reset();
        },
        onError: (err: unknown) => {
          const errorMessage = (err as { response?: { data?: { message?: string } } })
            ?.response?.data?.message || "Failed to update password";
          toast.error(errorMessage);
        },
      }
    );
  });


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TrainerSidebar />


      <div className="flex-1 flex flex-col">
        <TrainerHeader />


        <main className="flex-1 p-6 md:p-10">
          <div className="mx-auto max-w-lg">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200">
                <h1 className="text-lg font-semibold text-gray-900">Change Password</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Update your trainer account password
                </p>
              </div>


              {/* Form */}
              <form onSubmit={onSubmit} className="p-6 space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      {...register("oldPassword", { required: "Current password is required" })}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.oldPassword && (
                    <p className="text-red-600 text-sm mt-1.5">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </div>


                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      {...register("newPassword", {
                        required: "New password is required",
                        minLength: { value: 6, message: "Minimum 6 characters required" },
                        validate: {
                          uppercase: (v) => /[A-Z]/.test(v) || "At least one uppercase letter required",
                          number: (v) => /[0-9]/.test(v) || "At least one number required",
                          symbol: (v) => /[^A-Za-z0-9]/.test(v) || "At least one symbol required",
                        },
                      })}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-600 text-sm mt-1.5">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>


                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === newPasswordValue || "Passwords do not match",
                      })}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1.5">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>


                <div className="pt-4">
                 <button
  type="submit"
  disabled={isPending}
  className="w-full py-2.5 px-4 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  {isPending ? "Updating..." : "Update Password"}
</button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


export default ChangeTrainerPasswordPage;
