import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import UserSidebar from '../../../components/user/Sidebar';
import Header from '../../../components/user/Header';

// Hooks
import {
  useGetUserProfile,
  useUpdateUserProfile,
} from '../../../hooks/User/userServiceHooks';

// ── Validation Schema ────────────────────────────────────────────────
const userProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  profileImage: z.any().optional(), // we'll handle FileList manually
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

// ── API Response Types ───────────────────────────────────────────────
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: string;
  verificationCheck: boolean;
  userProfileCompleted: boolean;
  profileImage?: string;
}

interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    result: UserProfile;
  };
}

// ── Main Component ───────────────────────────────────────────────────
const EditUserPersonalPage = () => {
  const navigate = useNavigate();

  // Fetch current profile
  const { data, isLoading: isFetching, error } = useGetUserProfile();

  // Update mutation
  const { mutate, isPending: isUpdating } = useUpdateUserProfile();

  const profile = (data as UserProfileResponse | undefined)?.data?.result;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    // setValue,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      profileImage: undefined,
    },
  });

  // Reset form when profile data arrives
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        profileImage: undefined, // file inputs cannot be pre-filled for security
      });
    }
  }, [profile, reset]);

  const profileImageFile = watch('profileImage') as FileList | undefined;

  const onSubmit = (values: UserProfileFormData) => {
    const formData = new FormData();

    // Only append fields that exist / were changed
    if (values.name) formData.append('name', values.name);
    if (values.email) formData.append('email', values.email);
    if (values.phone) formData.append('phone', values.phone);

    // File upload
    if (values.profileImage instanceof FileList && values.profileImage[0]) {
      formData.append('profileImage', values.profileImage[0]);
    }

    mutate(formData, {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        navigate('/profile');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Failed to update profile');
      },
    });
  };

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-600">
        Failed to load profile. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl">
            {/* Header + Back */}
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ArrowLeft size={16} />
                Back to Profile
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Personal Information
              </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="shrink-0">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
                    {profileImageFile?.[0] ? (
                      <img
                        src={URL.createObjectURL(profileImageFile[0])}
                        alt="New profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt="Current profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://via.placeholder.com/128?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Choose new photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register('profileImage')}
                      />
                    </label>
                    <p className="text-sm text-gray-500">PNG, JPG, max 5MB</p>
                  </div>
                  {errors.profileImage && (
                    <p className="text-sm text-red-600">
                      {errors.profileImage.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="10-digit number"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditUserPersonalPage;
