import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import ProfilePageImg from '../../../assets/ProfilePageImg.jpg';
import { useCreateUserProfile } from '../../../hooks/User/userServiceHooks';
import { useNavigate } from 'react-router-dom';


// Step 1 Schema - Basic Body Info
const step1Schema = z.object({
  age: z.coerce
    .number()
    .int()
    .min(13, 'Age must be at least 13')
    .max(100, 'Invalid age'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Please select your gender',
  }),
  height: z.coerce.number().min(50, 'Height must be in cm').max(250),
  weight: z.coerce.number().min(20).max(300),
  profileImage: z.instanceof(FileList).optional(),
});

// Step 2 Schema - Fitness Preferences
const step2Schema = z.object({
  fitnessGoal: z.enum(
    ['lose weight', 'gain muscle', 'maintain fitness', 'improve endurance', 'flexibility', 'general health'],
    {
      message: 'Please select your fitness goal',
    }
  ),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    message: 'Please select your experience level',
  }),
  targetWeight: z.coerce.number().min(20).max(300),
  preferredWorkoutTypes: z.array(z.string()).min(1, 'Please select at least one workout type'),
  workoutLocation: z.enum(['gym', 'home'], {
    message: 'Please select your workout location',
  }),
  dietPreference: z
    .enum(['vegan', 'vegetarian', 'omnivore', 'other'])
    .optional(),
  medicalConditions: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const ProfileCompletion = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const navigate = useNavigate();

  // React Query Mutation
  const { mutate: createProfile, isPending } = useCreateUserProfile();

  // Step 1 Form
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    watch: watch1,
    formState: { errors: errors1 },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema) as any,
  });

  // Step 2 Form
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    formState: { errors: errors2 },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema) as any,
  });

  // Watch Step 1 fields for button state
  const age = watch1('age');
  const gender = watch1('gender');
  const height = watch1('height');
  const weight = watch1('weight');
  const isStep1Valid = age && gender && height && weight;

  // Step 1: Next Button
  const onNext = (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  // Handle workout type selection (single selection now)
  const handleWorkoutToggle = (workout: string) => {
    const updated = selectedWorkouts.includes(workout)
      ? selectedWorkouts.filter((w) => w !== workout)
      : [...selectedWorkouts, workout];
    setSelectedWorkouts(updated);
    setValue2('preferredWorkoutTypes', updated);
  };

  // Step 2: Final Submit
  const onSubmit = (data: Step2Data) => {
    if (!step1Data) return;

    // Create FormData
    const formData = new FormData();

    // Add Step 1 data - convert numbers to strings for FormData
    formData.append('age', step1Data.age.toString());
    formData.append('gender', step1Data.gender);
    formData.append('height', step1Data.height.toString());
    formData.append('weight', step1Data.weight.toString());

    // Add profile image if provided
    if (step1Data.profileImage && step1Data.profileImage.length > 0) {
      formData.append('profileImage', step1Data.profileImage[0]);
    }

    // Add Step 2 data
    formData.append('fitnessGoal', data.fitnessGoal);
    formData.append('experienceLevel', data.experienceLevel);
    formData.append('targetWeight', data.targetWeight.toString());
    formData.append('workoutLocation', data.workoutLocation);

    // Add preferred workout types as JSON array
    if (data.preferredWorkoutTypes && data.preferredWorkoutTypes.length > 0) {
      formData.append('preferredWorkoutTypes', JSON.stringify(data.preferredWorkoutTypes));
    }
    
    // Add optional fields if provided
    if (data.dietPreference) {
      formData.append('dietPreference', data.dietPreference);
    }
    if (data.medicalConditions && data.medicalConditions.trim()) {
      // Split by comma or newline and create array
      const conditions = data.medicalConditions
        .split(/[,\n]+/)
        .map(c => c.trim())
        .filter(c => c.length >= 2);
      if (conditions.length > 0) {
        // Send as JSON string - backend will parse it
        formData.append('medicalConditions', JSON.stringify(conditions));
      }
    }

    // Use React Query Mutation
    createProfile(formData, {
      onSuccess: (res: any) => {
        toast.success(res.message || 'Profile created successfully!');
        navigate('/home');
        setStep(3);
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || 'Failed to create profile'
        );
      },
    });
  };

  const handleSkip = () => {
    toast.error(
      'Profile completion is required to generate workout and diet plans'
    );
    // Navigate to dashboard - you can add navigation here
    console.log('Navigating to dashboard...');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-6 px-4 sm:py-10 relative"
      style={{ backgroundImage: `url(${ProfilePageImg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
            Complete Your Profile
          </h1>
          <p className="text-gray-200 text-sm sm:text-base mt-2 drop-shadow">
            Help us personalize your fitness journey
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center mb-10">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all shadow-lg ${
                  step >= num ? 'bg-emerald-500' : 'bg-gray-500'
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`w-20 h-1 mx-3 transition-all ${
                    step > num ? 'bg-emerald-500' : 'bg-gray-500'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Step 1 - Basic Body Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Basic Body Information
                </h2>
                <p className="text-sm text-gray-500 mt-1">Step 1 of 2</p>
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image (Optional)
                </label>
                <label className="block border-2 border-dashed border-gray-400 rounded-xl h-40 cursor-pointer hover:border-emerald-500 transition group">
                  <div className="flex flex-col items-center justify-center h-full space-y-3">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 group-hover:text-emerald-600 transition">
                        Click to upload profile picture
                      </p>
                      <p className="text-xs text-gray-500">JPG, PNG (Max 5MB)</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    {...register1('profileImage')}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-600">*</span>
                </label>
                <input
                  {...register1('age')}
                  type="number"
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors1.age && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors1.age.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Gender <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['male', 'female', 'other'].map((option) => (
                    <label
                      key={option}
                      className="relative flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition"
                    >
                      <input
                        type="radio"
                        value={option}
                        {...register1('gender')}
                        className="sr-only peer"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize peer-checked:text-emerald-600">
                        {option}
                      </span>
                      <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </label>
                  ))}
                </div>
                {errors1.gender && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors1.gender.message}
                  </p>
                )}
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm) <span className="text-red-600">*</span>
                </label>
                <input
                  {...register1('height')}
                  type="number"
                  placeholder="Enter your height in cm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors1.height && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors1.height.message}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Weight (kg) <span className="text-red-600">*</span>
                </label>
                <input
                  {...register1('weight')}
                  type="number"
                  placeholder="Enter your weight in kg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors1.weight && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors1.weight.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition"
                >
                  {/* Skip for Now */}
                </button>
                <button
                  onClick={handleSubmit1(onNext)}
                  disabled={!isStep1Valid}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition shadow-md"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2 - Fitness Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Fitness Preferences
                </h2>
                <p className="text-sm text-gray-500 mt-1">Step 2 of 2</p>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fitness Goal <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'lose weight',
                    'gain muscle',
                    'maintain fitness',
                    'improve endurance',
                    'flexibility',
                    'general health',
                  ].map((goal) => (
                    <label
                      key={goal}
                      className="relative flex items-center px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition"
                    >
                      <input
                        type="radio"
                        value={goal}
                        {...register2('fitnessGoal')}
                        className="sr-only peer"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize peer-checked:text-emerald-600">
                        {goal}
                      </span>
                      <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </label>
                  ))}
                </div>
                {errors2.fitnessGoal && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors2.fitnessGoal.message}
                  </p>
                )}
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Experience Level <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <label
                      key={level}
                      className="relative flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition"
                    >
                      <input
                        type="radio"
                        value={level}
                        {...register2('experienceLevel')}
                        className="sr-only peer"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize peer-checked:text-emerald-600">
                        {level}
                      </span>
                      <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </label>
                  ))}
                </div>
                {errors2.experienceLevel && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors2.experienceLevel.message}
                  </p>
                )}
              </div>

              {/* Target Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Weight (kg) <span className="text-red-600">*</span>
                </label>
                <input
                  {...register2('targetWeight')}
                  type="number"
                  placeholder="Enter your target weight"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors2.targetWeight && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors2.targetWeight.message}
                  </p>
                )}
              </div>

              {/* Preferred Workout Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Workout Types <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">Select one or more workout types</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['strength', 'cardio', 'flexibility', 'mixed'].map(
                    (workout) => (
                      <button
                        type="button"
                        key={workout}
                        onClick={() => handleWorkoutToggle(workout)}
                        className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg transition ${
                          selectedWorkouts.includes(workout)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <span
                          className={`text-sm font-medium capitalize ${
                            selectedWorkouts.includes(workout)
                              ? 'text-emerald-600'
                              : 'text-gray-700'
                          }`}
                        >
                          {workout}
                        </span>
                      </button>
                    )
                  )}
                </div>
                {errors2.preferredWorkoutTypes && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors2.preferredWorkoutTypes.message}
                  </p>
                )}
              </div>

              {/* Workout Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Workout Location <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['gym', 'home'].map((location) => (
                    <label
                      key={location}
                      className="relative flex items-center justify-center px-6 py-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition"
                    >
                      <input
                        type="radio"
                        value={location}
                        {...register2('workoutLocation')}
                        className="sr-only peer"
                      />
                      <div className="flex flex-col items-center">
                        {location === 'gym' ? (
                          <svg className="w-8 h-8 text-gray-600 peer-checked:text-emerald-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h3m0 0v8m0-8l3-3m-3 3l-3-3m15 3h3m0 0v8m0-8l-3-3m3 3l3-3M9 21h6M7 8h10" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-gray-600 peer-checked:text-emerald-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        )}
                        <span className="text-sm font-medium text-gray-700 capitalize peer-checked:text-emerald-600">
                          {location}
                        </span>
                      </div>
                      <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </label>
                  ))}
                </div>
                {errors2.workoutLocation && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors2.workoutLocation.message}
                  </p>
                )}
              </div>

              {/* Diet Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Diet Preference 
                </label>
                <select
                  {...register2('dietPreference')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select a diet preference</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions (Optional)
                </label>
                <textarea
                  {...register2('medicalConditions')}
                  rows={4}
                  placeholder="List any medical conditions, separated by commas or new lines (e.g., diabetes, heart condition, injuries)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Each condition must be at least 2 characters. Separate multiple conditions with commas or new lines.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit2(onSubmit)}
                  disabled={isPending}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium rounded-lg transition shadow-md"
                >
                  {isPending ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Completing Profile...
                    </span>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Success */}
          {step === 3 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-14 h-14 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Profile Completed!
              </h2>
              <p className="text-gray-600 text-lg mb-2">
                Your profile is all set up.
              </p>
              <p className="text-gray-500">
                You can now generate personalized workout and diet plans!
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-white/80 text-xs mt-8 drop-shadow">
          Questions? support@fitnessapp.com
        </p>
      </div>
    </div>
  );
};

export default ProfileCompletion;