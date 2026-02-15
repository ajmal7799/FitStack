// src/components/modals/EditSubscriptionModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';

// Zod validation schema
const editSubscriptionSchema = z.object({
  planName: z
    .string()
    .min(1, 'Plan name is required'),

  price: z
    .number()
    .refine((val) => val > 0, {
      message: 'Price must be greater than 0',
    }),

  durationMonths: z
    .number()
    .int('Duration must be a whole number')
    .min(1, 'Minimum duration is 1 month')
    .max(36, 'Maximum duration is 36 months'),
    
  description: z
    .string()
    .min(1, 'Description is required'),
});

type EditSubscriptionFormData = z.infer<typeof editSubscriptionSchema>;

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditSubscriptionFormData) => void;
  isLoading: boolean;
  initialData: {
    _id: string;
    planName: string;
    price: number;
    durationMonths: number;
    description: string;
    isActive: string;
  } | null;
  isLoadingData: boolean;
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  isLoadingData,
}) => {
  const [formData, setFormData] = useState({
    planName: '',
    price: '',
    durationMonths: '',
    description: '',
  });

  const [errors, setErrors] = useState<{
    planName?: string;
    price?: string;
    durationMonths?: string;
    description?: string;
  }>({});

  // Populate form when initialData is loaded
  useEffect(() => {
    if (initialData) {
      setFormData({
        planName: initialData.planName || '',
        price: initialData.price.toString() || '',
        durationMonths: initialData.durationMonths.toString() || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for the field being edited
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    try {
      // Convert string values to numbers for validation
      const dataToValidate = {
        planName: formData.planName.trim(),
        price: parseFloat(formData.price),
        durationMonths: parseInt(formData.durationMonths),
        description: formData.description.trim(),
      };

      // Validate with Zod
      editSubscriptionSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: {
          planName?: string;
          price?: string;
          durationMonths?: string;
          description?: string;
        } = {};

        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof typeof formattedErrors;
          if (field) {
            formattedErrors[field] = issue.message;
          }
        });

        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        planName: formData.planName.trim(),
        price: parseFloat(formData.price),
        durationMonths: parseInt(formData.durationMonths),
        description: formData.description.trim(),
      });
    }
  };

  const handleClose = () => {
    setFormData({
      planName: '',
      price: '',
      durationMonths: '',
      description: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Subscription Plan
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Loading plan details...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 transition ${
                  errors.planName ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="e.g., Premium Plan"
              />
              {errors.planName && (
                <p className="text-red-500 text-sm mt-1">{errors.planName}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price  <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={isLoading}
                step="0.01"
                min="0"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 transition ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="e.g., 29.99"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (Months) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="durationMonths"
                value={formData.durationMonths}
                onChange={handleChange}
                disabled={isLoading}
                min="1"
                max="36"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 transition ${
                  errors.durationMonths ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="e.g., 12"
              />
              {errors.durationMonths && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.durationMonths}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Minimum: 1 month, Maximum: 36 months
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 transition resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Describe the plan features and benefits..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Plan'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSubscriptionModal;