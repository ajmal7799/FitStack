import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, DollarSign, Calendar, FileText, Sparkles } from "lucide-react";

// Zod validation schema
const subscriptionSchema = z.object({
  planName: z
    .string()
    .min(3, "Plan name must be at least 3 characters")
    .max(50, "Plan name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Only letters, numbers, spaces and hyphens allowed"),

  price: z
    .number()
    .min(0.01, "Price must be at least $0.01")
    .max(999999, "Price cannot exceed $999,999"),

  durationMonths: z
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day")
    .max(3650, "Duration cannot exceed 3650 days (10 years)"),

  description: z
    .string()
    .min(1, "Description is required")
    // .optional()
    // .or(z.literal("")),
});

type FormData = z.infer<typeof subscriptionSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    planName: string;
    price: number;
    durationMonths: number;
    description: string;
  }) => void;
  isLoading?: boolean;
}

const CreateSubscriptionModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(subscriptionSchema),
    mode: "onChange",
    defaultValues: {
      planName: "",
      price: undefined,
      durationMonths: undefined,
      description: "",
    },
  });

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onFormSubmit)(e);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create Subscription Plan</h2>
              <p className="text-indigo-100 text-sm mt-0.5">Add a new subscription tier</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Plan Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="text-indigo-600" />
              Plan Name
            </label>
            <input
              {...register("planName")}
              className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                errors.planName
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-indigo-500"
              }`}
              placeholder="e.g., Pro Monthly, Enterprise Annual"
            />
            {errors.planName && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.planName.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign size={16} className="text-indigo-600" />
              Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl transition focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                  errors.price
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-500"
                }`}
                placeholder="29.99"
              />
            </div>
            {errors.price && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.price.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={16} className="text-indigo-600" />
              Duration (Days)
            </label>
            <input
              type="number"
              {...register("durationMonths", { valueAsNumber: true })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                errors.durationMonths
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-indigo-500"
              }`}
              placeholder="30"
            />
            <p className="text-xs text-gray-500 mt-1.5">Common: 30 (monthly), 90 (quarterly), 365 (annual)</p>
            {errors.durationMonths && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.durationMonths.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-gray-400 text-xs font-normal"></span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className={`w-full px-4 py-3 border-2 rounded-xl transition focus:outline-none focus:ring-4 focus:ring-indigo-500/20 resize-none ${
                errors.description
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-indigo-500"
              }`}
              placeholder="Unlimited projects, priority support, advanced analytics..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.description.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-lg shadow-indigo-500/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating...
                </span>
              ) : (
                "Create Plan"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionModal;