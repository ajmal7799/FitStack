import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainerSidebar from '../../../components/trainer/Sidebar';
import TrainerHeader from '../../../components/trainer/Header';
import {
  useGetTrainerProfile,
  useUpdateTrainerProfile,
} from '../../../hooks/Trainer/TrainerHooks';
import { ArrowLeft, Camera, Loader2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const TrainerProfileEdit = () => {
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
      const profile = profileData;
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        qualification: profile.qualification || '',
        specialisation: profile.specialisation || '',
        experience: profile.experience || 0,
        about: profile.about || '',
      });
      setImagePreview(profile.profileImage || '');
    }
  }, [profileData]);

  const validateField = (name: string, value: string | number): string => {
    switch (name) {
    case 'name':
      return typeof value === 'string' && value.length < 3
        ? 'Name must be at least 3 characters'
        : '';
    case 'email':
      return typeof value === 'string' &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? 'Invalid email address'
        : '';
    case 'phone':
      return typeof value === 'string' && !/^\d{10}$/.test(value)
        ? 'Phone number must be 10 digits'
        : '';
    case 'qualification':
      return typeof value === 'string' && value.length < 2
        ? 'Qualification must be at least 2 characters long'
        : '';
    case 'specialisation':
      return typeof value === 'string' && value.length < 2
        ? 'Specialisation must be at least 2 characters long'
        : '';
    case 'experience':
      return typeof value === 'number' && value < 0
        ? 'Experience must be 0 or more years'
        : '';
    case 'about':
      return typeof value === 'string' && value.length < 20
        ? 'About me must be at least 20 characters'
        : '';
    default:
      return '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const processedValue = name === 'experience' ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    const error = validateField(name, processedValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: 'Image size must be less than 5MB',
        }));
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, profileImage: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });

    if (imageFile) {
      submitData.append('profileImage', imageFile);
    }

    try {
      await updateProfile(submitData);
      toast.success('Profile updated successfully!',{
        duration:4000
      });
      navigate('/trainer/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setErrors((prev) => ({
        ...prev,
        submit:
          error?.response?.data?.message ||
          'Failed to update profile. Please try again.',
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/trainer/profile');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-black">
        <TrainerSidebar />
        <div className="flex-1 flex flex-col">
          <TrainerHeader />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen bg-black">
        <TrainerSidebar />
        <div className="flex-1 flex flex-col">
          <TrainerHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">
                Error loading profile data
              </div>
              <button
                onClick={() => navigate('/trainer/profile')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <TrainerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TrainerHeader />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={handleCancel}  // ← reuse your existing cancel handler
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />   {/* import { ArrowLeft } from "lucide-react" */}
              </button>
  
              <div>
                <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                <p className="text-gray-400 mt-1">Update your professional information</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Profile Image */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Profile Picture
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Camera className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      Upload a professional photo
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      JPG, PNG or GIF. Max size 5MB
                    </p>
                    {errors.profileImage && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.profileImage}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="10 digit phone number"
                      maxLength={10}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Experience (Years) *
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Years of experience"
                    />
                    {errors.experience && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.experience}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Professional Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Qualification *
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Your qualification"
                    />
                    {errors.qualification && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.qualification}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Specialisation *
                    </label>
                    <input
                      type="text"
                      name="specialisation"
                      value={formData.specialisation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Your specialisation"
                    />
                    {errors.specialisation && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.specialisation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      About Me *
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                      placeholder="Tell us about yourself (minimum 20 characters)"
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.about && (
                        <p className="text-red-500 text-xs">{errors.about}</p>
                      )}
                      <p className="text-gray-500 text-xs ml-auto">
                        {formData.about.length} / 20 minimum
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                  <p className="text-red-500 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 border border-gray-700"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfileEdit;