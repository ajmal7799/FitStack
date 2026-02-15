import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
// import { AxiosError } from 'axios'; // ← added this import
import type { UserBodyMetricsPayload } from '../../../types/UserBodyMetricsPayload';
// Components
import UserSidebar from '../../../components/user/Sidebar';
import Header from '../../../components/user/Header';

// Hooks
import { useGetPersonalInfo, useUpdatePersonalInfo } from '../../../hooks/User/userServiceHooks';

// ── Zod Schema (no coerce – use valueAsNumber instead) ────────────────
const bodyMetricsSchema = z.object({
  age: z
    .number()
    .int()
    .min(13, 'Age must be at least 13')
    .max(100, 'Invalid age'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Please select your gender',
  }),
  height: z
    .number()
    .min(50, 'Height must be in cm')
    .max(250),
  weight: z
    .number()
    .min(20)
    .max(300),
  fitnessGoal: z.enum(
    ['lose weight', 'gain muscle', 'maintain fitness', 'improve endurance', 'flexibility', 'general health'],
    {
      message: 'Please select your fitness goal',
    }
  ),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    message: 'Please select your experience level',
  }),
  targetWeight: z
    .number()
    .min(20)
    .max(300),
  preferredWorkoutTypes: z.array(z.string()).min(1, 'Please select at least one workout type'),
  workoutLocation: z.enum(['gym', 'home'], {
    message: 'Please select your workout location',
  }),
  dietPreference: z.enum(['vegan', 'vegetarian', 'omnivore', 'other']).optional(),
  medicalConditions: z.string().optional(),
});

type BodyMetricsFormData = z.infer<typeof bodyMetricsSchema>;

// ── API Types ─────────────────────────────────────────────────────────
interface PersonalInfo {
  userId: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessGoal: string;
  targetWeight: number;
  dietPreference: string;
  experienceLevel: string;
  workoutLocation: string;
  preferredWorkoutTypes: string[];
  medicalConditions: string[];
  profileCompleted: boolean;
}

interface PersonalInfoResponse {
  success: boolean;
  message: string;
  data: {
    result: PersonalInfo;
  };
}

const UserBodyMetricsEditPage = () => {
  const navigate = useNavigate();

  const { data, isLoading: isFetching, error } = useGetPersonalInfo();
  const { mutate, isPending: isUpdating } = useUpdatePersonalInfo();

  const info = (data as PersonalInfoResponse | undefined)?.data?.result;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    
  } = useForm<BodyMetricsFormData>({
    resolver: zodResolver(bodyMetricsSchema),
    defaultValues: {
      age: 0,
      gender: 'male',
      height: 0,
      weight: 0,
      fitnessGoal: 'maintain fitness',
      experienceLevel: 'intermediate',
      targetWeight: 0,
      preferredWorkoutTypes: [],
      workoutLocation: 'home',
      dietPreference: undefined, // optional field
      medicalConditions: '',
    },
  });

  useEffect(() => {
    if (info) {
      reset({
        age: info.age ?? 0,
        gender: info.gender as 'male' | 'female' | 'other',
        height: info.height ?? 0,
        weight: info.weight ?? 0,
        fitnessGoal: info.fitnessGoal as BodyMetricsFormData['fitnessGoal'],
        experienceLevel: info.experienceLevel as BodyMetricsFormData['experienceLevel'],
        targetWeight: info.targetWeight ?? 0,
        preferredWorkoutTypes: info.preferredWorkoutTypes ?? [],
        workoutLocation: info.workoutLocation as 'gym' | 'home',
        dietPreference: info.dietPreference ? (info.dietPreference as BodyMetricsFormData['dietPreference']) : undefined,
        medicalConditions: info.medicalConditions?.join(', ') ?? '',
      });
    }
  }, [info, reset]);

  const onSubmit = (values: BodyMetricsFormData) => {
    const payload: UserBodyMetricsPayload = {
      age: values.age,
      gender: values.gender,
      height: values.height,
      weight: values.weight,
      fitnessGoal: values.fitnessGoal,
      targetWeight: values.targetWeight,
      dietPreference: values.dietPreference ?? '',
      experienceLevel: values.experienceLevel,
      workoutLocation: values.workoutLocation,
      preferredWorkoutTypes: values.preferredWorkoutTypes,
      medicalConditions: values.medicalConditions
        ? values.medicalConditions.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      profileCompleted: info?.profileCompleted ?? true,
    };

    const toastId = toast.loading('Saving body metrics...');

    mutate(payload, {
      onSuccess: () => {
        toast.success('Body metrics updated successfully!', { id: toastId });
        navigate('/profile/personal-info');
      },
      onError: (err: any) => {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Failed to update body metrics. Please try again.';
        toast.error(message, { id: toastId });
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

  if (error || !info) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-600">
        Failed to load personal information. Please try again later.
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
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ArrowLeft size={16} />
                Back to Profile
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Body Metrics & Preferences</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Metrics */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.age && <p className="mt-1.5 text-sm text-red-600">{errors.age.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    {...register('gender')}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="mt-1.5 text-sm text-red-600">{errors.gender.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    {...register('height', { valueAsNumber: true })}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.height && <p className="mt-1.5 text-sm text-red-600">{errors.height.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    {...register('weight', { valueAsNumber: true })}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.weight && <p className="mt-1.5 text-sm text-red-600">{errors.weight.message}</p>}
                </div>
              </div>

              {/* Goal & Experience */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
                  <select
                    {...register('fitnessGoal')}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="lose weight">Lose Weight</option>
                    <option value="gain muscle">Gain Muscle</option>
                    <option value="maintain fitness">Maintain Fitness</option>
                    <option value="improve endurance">Improve Endurance</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="general health">General Health</option>
                  </select>
                  {errors.fitnessGoal && <p className="mt-1.5 text-sm text-red-600">{errors.fitnessGoal.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <select
                    {...register('experienceLevel')}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.experienceLevel && <p className="mt-1.5 text-sm text-red-600">{errors.experienceLevel.message}</p>}
                </div>
              </div>

              {/* Target, Location, Diet */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Weight (kg)</label>
                  <input
                    type="number"
                    {...register('targetWeight', { valueAsNumber: true })}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.targetWeight && <p className="mt-1.5 text-sm text-red-600">{errors.targetWeight.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workout Location</label>
                  <select
                    {...register('workoutLocation')}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="gym">Gym</option>
                    <option value="home">Home</option>
                  </select>
                  {errors.workoutLocation && <p className="mt-1.5 text-sm text-red-600">{errors.workoutLocation.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diet Preference</label>
                  <select
                    {...register('dietPreference')}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">No preference</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Preferred Workout Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Workout Types</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    'strength', 'cardio', 'flexibility', 'mixed'
                  ].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={type}
                        {...register('preferredWorkoutTypes')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredWorkoutTypes && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.preferredWorkoutTypes?.message}</p>
                )}
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions (comma separated)
                </label>
                <textarea
                  {...register('medicalConditions')}
                  rows={2}
                  placeholder="e.g. asthma, knee injury, hypertension"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

export default UserBodyMetricsEditPage;