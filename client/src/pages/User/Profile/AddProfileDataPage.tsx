import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useCreateUserProfile } from '../../../hooks/User/userServiceHooks';
import { useNavigate } from 'react-router-dom';

const step1Schema = z.object({
  age: z.coerce.number().int().min(13, 'Age must be at least 13').max(100, 'Invalid age'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Please select your gender' }),
  height: z.coerce.number().min(50, 'Height must be in cm').max(250),
  weight: z.coerce.number().min(20).max(300),
  profileImage: z.instanceof(FileList).optional(),
});

const step2Schema = z.object({
  fitnessGoal: z.enum(
    ['lose weight', 'gain muscle', 'maintain fitness', 'improve endurance', 'flexibility', 'general health'],
    { message: 'Please select your fitness goal' }
  ),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    message: 'Please select your experience level',
  }),
  targetWeight: z.coerce.number().min(20).max(300),
  preferredWorkoutTypes: z.array(z.string()).min(1, 'Please select at least one workout type'),
  workoutLocation: z.enum(['gym', 'home'], { message: 'Please select your workout location' }),
  dietPreference: z.enum(['vegan', 'vegetarian', 'omnivore', 'other']).optional(),
  medicalConditions: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const ProfileCompletion = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { mutate: createProfile, isPending } = useCreateUserProfile();

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    watch: watch1,
    formState: { errors: errors1 },
  } = useForm<Step1Data>({ resolver: zodResolver(step1Schema) as any });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    formState: { errors: errors2 },
  } = useForm<Step2Data>({ resolver: zodResolver(step2Schema) as any });

  const age    = watch1('age');
  const gender = watch1('gender');
  const height = watch1('height');
  const weight = watch1('weight');
  const isStep1Valid = age && gender && height && weight;

  const onNext = (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleWorkoutToggle = (workout: string) => {
    const updated = selectedWorkouts.includes(workout)
      ? selectedWorkouts.filter((w) => w !== workout)
      : [...selectedWorkouts, workout];
    setSelectedWorkouts(updated);
    setValue2('preferredWorkoutTypes', updated);
  };

  const onSubmit = (data: Step2Data) => {
    if (!step1Data) return;
    const formData = new FormData();
    formData.append('age', step1Data.age.toString());
    formData.append('gender', step1Data.gender);
    formData.append('height', step1Data.height.toString());
    formData.append('weight', step1Data.weight.toString());
    if (step1Data.profileImage && step1Data.profileImage.length > 0) {
      formData.append('profileImage', step1Data.profileImage[0]);
    }
    formData.append('fitnessGoal', data.fitnessGoal);
    formData.append('experienceLevel', data.experienceLevel);
    formData.append('targetWeight', data.targetWeight.toString());
    formData.append('workoutLocation', data.workoutLocation);
    if (data.preferredWorkoutTypes?.length > 0) {
      formData.append('preferredWorkoutTypes', JSON.stringify(data.preferredWorkoutTypes));
    }
    if (data.dietPreference) formData.append('dietPreference', data.dietPreference);
    if (data.medicalConditions?.trim()) {
      const conditions = data.medicalConditions.split(/[,\n]+/).map(c => c.trim()).filter(c => c.length >= 2);
      if (conditions.length > 0) formData.append('medicalConditions', JSON.stringify(conditions));
    }

    createProfile(formData, {
      onSuccess: (res: any) => {
        toast.success(res.message || 'Profile created successfully!');
        setStep(3);
        setTimeout(() => navigate('/'), 1500);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create profile');
      },
    });
  };

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition bg-gray-50';

  return (
    // ✅ Key fix: min-h-screen + overflow-y-auto on root, no fixed heights
    <div className="min-h-screen bg-gray-50">

      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-sm">FitStack</span>
        </div>

        {step < 3 && (
          <div className="flex items-center gap-2">
            {[1, 2].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= num ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > num ? '✓' : num}
                </div>
                {num < 2 && <div className={`w-8 h-0.5 rounded-full ${step > num ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        )}

        <span className="text-xs text-gray-400">{step < 3 ? `Step ${step} of 2` : 'Done!'}</span>
      </div>

      {/* Page content — naturally scrolls */}
      <div className="py-6 px-4">
        <div className="max-w-xl mx-auto">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-emerald-50">
                <h2 className="text-base font-semibold text-gray-800">Basic Body Information</h2>
                <p className="text-xs text-gray-500 mt-0.5">Fields marked * are required</p>
              </div>

              <div className="p-5 space-y-4">

                {/* Profile Image */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Profile Photo <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40 transition">
                    {previewImage ? (
                      <img src={previewImage} alt="preview" className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-emerald-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-600">{previewImage ? 'Change photo' : 'Upload a photo'}</p>
                      <p className="text-xs text-gray-400">JPG, PNG · Max 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      {...register1('profileImage')}
                      onChange={(e) => {
                        register1('profileImage').onChange(e);
                        const file = e.target.files?.[0];
                        if (file) setPreviewImage(URL.createObjectURL(file));
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input {...register1('age')} type="number" placeholder="e.g. 25" className={inputClass} />
                  {errors1.age && <p className="text-red-500 text-xs mt-1">{errors1.age.message}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['male', 'female', 'other'].map((option) => (
                      <label key={option} className="relative flex items-center justify-center px-3 py-2.5 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-400 transition">
                        <input type="radio" value={option} {...register1('gender')} className="sr-only peer" />
                        <span className="text-sm font-medium text-gray-700 capitalize peer-checked:text-emerald-600">{option}</span>
                        <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </label>
                    ))}
                  </div>
                  {errors1.gender && <p className="text-red-500 text-xs mt-1">{errors1.gender.message}</p>}
                </div>

                {/* Height + Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Height (cm) <span className="text-red-500">*</span>
                    </label>
                    <input {...register1('height')} type="number" placeholder="e.g. 175" className={inputClass} />
                    {errors1.height && <p className="text-red-500 text-xs mt-1">{errors1.height.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Weight (kg) <span className="text-red-500">*</span>
                    </label>
                    <input {...register1('weight')} type="number" placeholder="e.g. 70" className={inputClass} />
                    {errors1.weight && <p className="text-red-500 text-xs mt-1">{errors1.weight.message}</p>}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSubmit1(onNext)}
                    disabled={!isStep1Valid}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-emerald-50">
                <h2 className="text-base font-semibold text-gray-800">Fitness Preferences</h2>
                <p className="text-xs text-gray-500 mt-0.5">Help us tailor your plan</p>
              </div>

              <div className="p-5 space-y-4">

                {/* Fitness Goal */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Fitness Goal <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['lose weight', 'gain muscle', 'maintain fitness', 'improve endurance', 'flexibility', 'general health'].map((goal) => (
                      <label key={goal} className="relative flex items-center px-3 py-2.5 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-400 transition">
                        <input type="radio" value={goal} {...register2('fitnessGoal')} className="sr-only peer" />
                        <span className="text-xs font-medium text-gray-700 capitalize peer-checked:text-emerald-600">{goal}</span>
                        <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </label>
                    ))}
                  </div>
                  {errors2.fitnessGoal && <p className="text-red-500 text-xs mt-1">{errors2.fitnessGoal.message}</p>}
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <label key={level} className="relative flex items-center justify-center px-3 py-2.5 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-400 transition">
                        <input type="radio" value={level} {...register2('experienceLevel')} className="sr-only peer" />
                        <span className="text-xs font-medium text-gray-700 capitalize peer-checked:text-emerald-600">{level}</span>
                        <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </label>
                    ))}
                  </div>
                  {errors2.experienceLevel && <p className="text-red-500 text-xs mt-1">{errors2.experienceLevel.message}</p>}
                </div>

                {/* Target Weight */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Target Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input {...register2('targetWeight')} type="number" placeholder="Enter your target weight" className={inputClass} />
                  {errors2.targetWeight && <p className="text-red-500 text-xs mt-1">{errors2.targetWeight.message}</p>}
                </div>

                {/* Workout Types */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Workout Types <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['strength', 'cardio', 'flexibility', 'mixed'].map((workout) => (
                      <button
                        type="button"
                        key={workout}
                        onClick={() => handleWorkoutToggle(workout)}
                        className={`px-3 py-2.5 border-2 rounded-lg text-xs font-medium capitalize transition ${
                          selectedWorkouts.includes(workout)
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                            : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                        }`}
                      >
                        {workout}
                      </button>
                    ))}
                  </div>
                  {errors2.preferredWorkoutTypes && <p className="text-red-500 text-xs mt-1">{errors2.preferredWorkoutTypes.message}</p>}
                </div>

                {/* Workout Location */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Workout Location <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ value: 'gym', emoji: '🏋️' }, { value: 'home', emoji: '🏠' }].map(({ value, emoji }) => (
                      <label key={value} className="relative flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-400 transition">
                        <input type="radio" value={value} {...register2('workoutLocation')} className="sr-only peer" />
                        <span className="text-sm font-semibold text-gray-700 capitalize peer-checked:text-emerald-600">{emoji} {value}</span>
                        <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </label>
                    ))}
                  </div>
                  {errors2.workoutLocation && <p className="text-red-500 text-xs mt-1">{errors2.workoutLocation.message}</p>}
                </div>

                {/* Diet Preference */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Diet Preference <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <select {...register2('dietPreference')} className={inputClass}>
                    <option value="">Select a diet preference</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Medical Conditions */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Medical Conditions <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <textarea
                    {...register2('medicalConditions')}
                    rows={2}
                    placeholder="e.g. diabetes, heart condition — separate with commas"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit2(onSubmit)}
                    disabled={isPending}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm flex items-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </>
                    ) : 'Complete Profile'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 Success ── */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Completed!</h2>
              <p className="text-gray-500 text-sm">Redirecting you to home...</p>
            </div>
          )}

          {/* Bottom padding for mobile */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;