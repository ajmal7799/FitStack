import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import toast from 'react-hot-toast';
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

const BRAND_COLOR = "#eb9334";

const TrainerProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { data: profileData, isLoading, isError } = useGetTrainerProfile();
  const { mutateAsync: updateProfile } = useUpdateTrainerProfile();

  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validateField = (name: string, value: string | number): string => {
    switch (name) {
      case 'name': return String(value).length < 3 ? 'Name must be at least 3 characters' : '';
      case 'email': return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) ? 'Invalid email address' : '';
      case 'phone': return !/^\d{10}$/.test(String(value)) ? 'Phone number must be 10 digits' : '';
      case 'about': return String(value).length < 20 ? 'About me must be at least 20 characters' : '';
      default: return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'experience' ? Number(value) : value;

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, processedValue) }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'Image must be less than 5MB' }));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => submitData.append(key, value.toString()));
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

            <form onSubmit={handleSubmit} className="space-y-8">
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
                  <p className="text-slate-500 text-sm mb-2">Recommended: Square image, max 5MB</p>
                  {errors.profileImage && <p className="text-red-500 text-xs font-bold">{errors.profileImage}</p>}
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
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium"
                    />
                    {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Mail size={16} style={{ color: BRAND_COLOR }} /> Email Address
                    </label>
                    <input 
                      name="email" type="email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Phone size={16} style={{ color: BRAND_COLOR }} /> Phone Number
                    </label>
                    <input 
                      name="phone" value={formData.phone} onChange={handleInputChange} maxLength={10}
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Briefcase size={16} style={{ color: BRAND_COLOR }} /> Experience (Years)
                    </label>
                    <input 
                      name="experience" type="number" value={formData.experience} onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium"
                    />
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
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Dumbbell size={16} style={{ color: BRAND_COLOR }} /> Specialisations
                    </label>
                    <input 
                      name="specialisation" value={formData.specialisation} onChange={handleInputChange}
                      placeholder="e.g. Crossfit, Yoga, Strength Training (comma separated)"
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Biography / About Me</label>
                    <textarea 
                      name="about" rows={4} value={formData.about} onChange={handleInputChange}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-[#eb9334] outline-none transition-all font-medium resize-none"
                    />
                    <div className="flex justify-end"><span className="text-[10px] font-bold text-slate-400">{formData.about.length}/20 minimum</span></div>
                    {errors.about && <p className="text-red-500 text-xs font-medium">{errors.about}</p>}
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