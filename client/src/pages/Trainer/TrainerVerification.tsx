import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import BackgroundImg from "../../assets/BackGroundImg.jpg";
import { useSubmitTrainerVerification } from "../../hooks/Trainer/TrainerHooks";
import { useNavigate } from "react-router-dom";


const step1Schema = z.object({
  qualification: z.string().min(2, "Please enter your qualification"),
  specialisation: z.string().min(2, "Please enter your specialisation"),
  experience: z.coerce.number().min(0, "Experience must be 0 or more"),
  about: z.string().min(20, "Tell us at least 20 characters about yourself"),
});

const step2Schema = z.object({
  idCard: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "Personal ID Card is required"),
  educationCert: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "Education certificate is required"),
  experienceCert: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "Experience proof is required"),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const TrainerVerification: React.FC = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
    const navigate = useNavigate();
  
  // React Query Mutation
  const { mutate: submitVerification, isPending } = useSubmitTrainerVerification();

  // Step 1 Form
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1,
    formState: { errors: errors1 },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema) as any,
  });

  // Step 2 Form
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { errors: errors2 },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  });

  // Step 1: Next Button
  const onNext = (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
    
  };

  // Step 2: Submit with React Query + FormData
  const onSubmit = (data: Step2Data) => {
    if (!step1Data) return;

    // Create FormData
    const formData = new FormData();
    
    // Add Step 1 text data
    formData.append("qualification", step1Data.qualification);
    formData.append("specialisation", step1Data.specialisation);
    formData.append("experience", step1Data.experience.toString());
    formData.append("about", step1Data.about);

    // Add Step 2 files
    formData.append("idCard", data.idCard[0]!);
    formData.append("educationCert", data.educationCert[0]!);
    formData.append("experienceCert", data.experienceCert[0]!);
     
    // Use React Query Mutation
    submitVerification(formData, {
      onSuccess: (res:any) => {
       toast.success(res.message)
       navigate("/trainer/dashboard");
        setStep(3);
        reset1(); // Clear Step 1 form
        reset2(); // Clear Step 2 form
        
      },
      onError: (error: any) => {
       toast.error(error.response.data?.message || "Submission failed");
      },
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-6 px-4 sm:py-10 relative"
      style={{ backgroundImage: `url(${BackgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
            Trainer Verification
          </h1>
          <p className="text-gray-200 text-sm sm:text-base mt-2 drop-shadow">
            Complete your profile to get verified
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center items-center mb-10">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all shadow-lg ${
                  step >= num ? "bg-emerald-500" : "bg-gray-500"
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`w-20 h-1 mx-3 transition-all ${
                    step > num ? "bg-emerald-500" : "bg-gray-500"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleSubmit1(onNext)} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Qualifications & Experience</h2>

              <div>
                <input
                  {...register1("qualification")}
                  placeholder="Highest Qualification (e.g. B.P.Ed, NSCA-CPT)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 text-base"
                />
                {errors1.qualification && (
                  <p className="text-red-600 text-xs mt-1">{errors1.qualification.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register1("specialisation")}
                  placeholder="Specialisation (e.g. Weight Loss, Yoga, Powerlifting)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 text-base"
                />
                {errors1.specialisation && (
                  <p className="text-red-600 text-xs mt-1">{errors1.specialisation.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register1("experience")}
                  type="number"
                  placeholder="Years of Experience"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 text-base"
                />
                {errors1.experience && (
                  <p className="text-red-600 text-xs mt-1">{errors1.experience.message}</p>
                )}
              </div>

              <div>
                <textarea
                  {...register1("about")}
                  rows={4}
                  placeholder="About Me – your training style & achievements"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 text-base resize-none"
                />
                {errors1.about && (
                  <p className="text-red-600 text-xs mt-1">{errors1.about.message}</p>
                )}
              </div>

              <div className="flex justify-end mt-10">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition shadow-md"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit2(onSubmit)} className="space-y-7">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Upload Documents</h2>
                <p className="text-red-600 text-sm font-medium mt-1">All documents required</p>
              </div>

              {/* Personal ID Card */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal ID Card <span className="text-red-600">*</span>
                </label>
                <label className="block border-2 border-dashed border-gray-400 rounded-xl h-32 cursor-pointer hover:border-emerald-500 transition group">
                  <div className="flex flex-col items-center justify-center h-full space-y-3">
                    <div className="w-16 h-12 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h2l1 9h12l1-9h2M7 9V7a5 5 0 0110 0v2" />
                        <rect x="7" y="13" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 group-hover:text-emerald-600 transition">
                        Click to upload ID
                      </p>
                      <p className="text-xs text-gray-500">Aadhaar, Passport, DL etc.</p>
                    </div>
                  </div>
                  <input type="file" accept="image/*,.pdf" {...register2("idCard")} className="hidden" />
                </label>
                {errors2.idCard && <p className="text-red-600 text-xs mt-1">{errors2.idCard.message}</p>}
              </div>

              {/* Education Certificate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education Certificate</label>
                <label className="block border-2 border-dashed border-gray-400 rounded-xl h-28 cursor-pointer hover:border-emerald-500 transition group">
                  <div className="flex flex-col items-center justify-center h-full space-y-2">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 012 2z" />
                    </svg>
                    <p className="text-sm text-gray-600 group-hover:text-emerald-600 transition">Upload Degree / Diploma</p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF</p>
                  </div>
                  <input type="file" accept="image/*,.pdf" {...register2("educationCert")} className="hidden" />
                </label>
                {errors2.educationCert && <p className="text-red-600 text-xs mt-1">{errors2.educationCert.message}</p>}
              </div>

              {/* Experience Certificate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Certificate / Proof</label>
                <label className="block border-2 border-dashed border-gray-400 rounded-xl h-28 cursor-pointer hover:border-emerald-500 transition group">
                  <div className="flex flex-col items-center justify-center h-full space-y-2">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 012 2z" />
                    </svg>
                    <p className="text-sm text-gray-600 group-hover:text-emerald-600 transition">Upload Experience Letter</p>
                    <p className="text-xs text-gray-500">From previous gym/company</p>
                  </div>
                  <input type="file" accept="image/*,.pdf" {...register2("experienceCert")} className="hidden" />
                </label>
                {errors2.experienceCert && <p className="text-red-600 text-xs mt-1">{errors2.experienceCert.message}</p>}
              </div>

              <div className="flex justify-between mt-10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium rounded-lg transition shadow-md"
                >
                  {isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit for Verification"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-14 h-14 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">All Done!</h2>
              <p className="text-gray-600 text-lg">
                Your documents are submitted.<br />
                We'll review and approve within <strong>24–48 hours</strong>.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-white/80 text-xs mt-8 drop-shadow">
          Questions? support@yourgymapp.com
        </p>
      </div>
    </div>
  );
};

export default TrainerVerification;