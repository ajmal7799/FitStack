import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Camera, 
  Loader2, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Dumbbell, 
  Briefcase 
} from 'lucide-react';

// Components & Hooks
import TrainerSidebar from '../../../components/trainer/Sidebar';
import TrainerHeader from '../../../components/trainer/Header';
import {
  useGetTrainerProfile,
  useUpdateTrainerProfile,
} from '../../../hooks/Trainer/TrainerHooks';

const BRAND_COLOR = '#eb9334';

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const trainerProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes'),

  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),

  qualification: z
    .string()
    .trim()
    .min(1, 'Qualification is required')
    .min(5, 'Qualification must be at least 5 characters')
    .max(200, 'Qualification must not exceed 200 characters'),

  specialisation: z
    .string()
    .trim()
    .min(1, 'Specialisation is required')
    .min(3, 'Specialisation must be at least 3 characters')
    .max(300, 'Specialisation must not exceed 300 characters'),

  experience: z
    .number({ error: 'Experience must be a number' })
    .int('Experience must be a whole number')
    .min(0, 'Experience cannot be negative')
    .max(60, 'Experience must be realistic (max 60 years)'),

  about: z
    .string()
    .trim()
    .min(1, 'Biography is required')
    .min(20, 'Biography must be at least 20 characters')
    .max(1000, 'Biography must not exceed 1000 characters'),
});

type TrainerProfileFormData = z.infer<typeof trainerProfileSchema>;
type FormErrors = Partial<Record<keyof TrainerProfileFormData, string>>;

// ─────────────────────────────────────────────────────────────────────────────

const TrainerProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useGetTrainerProfile();
  const { mutateAsync: updateProfile } = useUpdateTrainerProfile();

  const [formData, setFormData] = useState<TrainerProfileFormData>({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    specialisation: '',
    experience: 0,
    about: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageError, setImageError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        qualification: profileData.qualification || '',
        specialisation: profileData.specialisation || '',
        experience: profileData.experience || 0,
        about: profileData.about || '',
      });
      setImagePreview(profileData.profileImage || '');
    }
  }, [profileData]);

  // Framer Motion Variants
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVars: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // ── Validate a single field on change ──────────────────────────────────────
 const validateField = (name: keyof TrainerProfileFormData, value: string | number) => {
  const fieldSchema = trainerProfileSchema.shape[name];
  const result = fieldSchema.safeParse(value);
  return result.success ? '' : result.error.issues[0].message;
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof TrainerProfileFormData;
    const processedValue = fieldName === 'experience' ? Number(value) : value;

    setFormData(prev => ({ ...prev, [fieldName]: processedValue }));
    setErrors(prev => ({ ...prev, [fieldName]: validateField(fieldName, processedValue) }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Only JPG, PNG, or WEBP images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ── Full form validation before submit ─────────────────────────────────────
const validateForm = (): boolean => {
  const result = trainerProfileSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: FormErrors = {};
    result.error.issues.forEach(issue => {         // ← .issues not .errors
      const field = issue.path[0] as keyof TrainerProfileFormData;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    });
    setErrors(fieldErrors);
    return false;
  }

  setErrors({});
  return true;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const result = trainerProfileSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: FormErrors = {};
    result.error.issues.forEach(issue => {
      const field = issue.path[0] as keyof TrainerProfileFormData;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    });
    setErrors(fieldErrors);
    toast.error('Please fix the errors before saving', {
      style: { borderRadius: '15px', background: '#333', color: '#fff' },
    });
    return;
  }

  // result.data has all strings trimmed by Zod
  setIsSaving(true);
  const submitData = new FormData();
  Object.entries(result.data).forEach(([key, value]) => submitData.append(key, value.toString()));
  if (imageFile) submitData.append('profileImage', imageFile);

  try {
    await updateProfile(submitData);
    toast.success('Profile updated!', { style: { borderRadius: '15px', background: '#333', color: '#fff' } });
    navigate('/trainer/profile');
  } catch (err: any) {
    toast.error('Failed to update profile');
  } finally {
    setIsSaving(false);
  }
};

  if (isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <TrainerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: BRAND_COLOR }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <TrainerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TrainerHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden" 
            animate="visible" 
            variants={containerVars}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => navigate('/trainer/profile')}
                className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-black tracking-tight">Edit <span style={{ color: BRAND_COLOR }}>Profile</span></h1>
                <p className="text-slate-500 text-sm font-medium">Keep your professional details up to date</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Image Upload Section */}
              <motion.div variants={itemVars} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  <label htmlFor="profileImage" className="absolute -bottom-2 -right-2 p-2.5 bg-slate-900 text-white rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    <Camera size={18} />
                    <input type="file" id="profileImage" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-lg">Profile Photo</h3>
                  <p className="text-slate-500 text-sm mb-2">Recommended: Square image, JPG/PNG/WEBP, max 5MB</p>
                  {imageError && <p className="text-red-500 text-xs font-bold">{imageError}</p>}
                </div>
              </motion.div>

              {/* Form Grid */}
              <motion.div variants={itemVars} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4">Core Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <User size={16} style={{ color: BRAND_COLOR }} /> Full Name
                    </label>
                    <input 
                      name="name" value={formData.name} onChange={handleInputChange}
                      className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Mail size={16} style={{ color: BRAND_COLOR }} /> Email Address
                    </label>
                    <input 
                      name="email" type="email" value={formData.email} onChange={handleInputChange}
                      className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Phone size={16} style={{ color: BRAND_COLOR }} /> Phone Number
                    </label>
                    <input 
                      name="phone" value={formData.phone} onChange={handleInputChange} maxLength={10}
                      className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium ${errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs font-medium">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Briefcase size={16} style={{ color: BRAND_COLOR }} /> Experience (Years)
                    </label>
                    <input 
                      name="experience" type="number" min={0} max={60} value={formData.experience} onChange={handleInputChange}
                      className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium ${errors.experience ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    />
                    {errors.experience && <p className="text-red-500 text-xs font-medium">{errors.experience}</p>}
                  </div>
                </div>
              </motion.div>

              {/* Professional Section */}
              <motion.div variants={itemVars} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4">Expertise & Skills</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <GraduationCap size={16} style={{ color: BRAND_COLOR }} /> Qualifications
                    </label>
                    <input 
                      name="qualification" value={formData.qualification} onChange={handleInputChange}
                      placeholder="e.g. Certified Personal Trainer, ACE"
                      className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium ${errors.qualification ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    />
                    {errors.qualification && <p className="text-red-500 text-xs font-medium">{errors.qualification}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Dumbbell size={16} style={{ color: BRAND_COLOR }} /> Specialisations
                    </label>
                    <input 
                      name="specialisation" value={formData.specialisation} onChange={handleInputChange}
                      placeholder="e.g. Crossfit, Yoga, Strength Training (comma separated)"
                      className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium ${errors.specialisation ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    />
                    {errors.specialisation && <p className="text-red-500 text-xs font-medium">{errors.specialisation}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Biography / About Me</label>
                    <textarea 
                      name="about" rows={4} value={formData.about} onChange={handleInputChange}
                      className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium resize-none ${errors.about ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    />
                    <div className="flex justify-between items-center">
                      {errors.about
                        ? <p className="text-red-500 text-xs font-medium">{errors.about}</p>
                        : <span />
                      }
                      <span className={`text-[10px] font-bold ${formData.about.length < 20 ? 'text-red-400' : 'text-slate-400'}`}>
                        {formData.about.length}/1000
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 justify-end pb-10">
                <button
                  type="button"
                  onClick={() => navigate('/trainer/profile')}
                  className="px-8 py-3 rounded-2xl font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-10 py-3 rounded-2xl font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: BRAND_COLOR }}
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TrainerProfileEdit;