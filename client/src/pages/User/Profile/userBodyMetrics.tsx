import { useGetPersonalInfo } from '../../../hooks/User/userServiceHooks';
import UserSidebar from '../../../components/user/Sidebar';
import Header from '../../../components/user/Header';
import { FRONTEND_ROUTES } from '../../../constants/frontendRoutes';
import { useNavigate } from 'react-router-dom';

// Type definitions
interface PersonalInfoData {
  userId: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  profileImage: string;
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
    result: PersonalInfoData;
  };
}

const PersonalInfo: React.FC = () => {
  const { data, isLoading, isError, error } = useGetPersonalInfo();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg text-gray-600">Loading personal info...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg text-red-600">
                Error loading personal info: {(error as Error)?.message || 'Something went wrong'}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const personalInfo: PersonalInfoData | undefined = (data as PersonalInfoResponse)?.data?.result;

  if (!personalInfo) {
    return (
      <div className="flex h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg text-gray-600">No personal info available</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const InfoCard = ({ icon, label, value, accent = 'blue' }: { icon: React.ReactNode, label: string, value: string | number, accent?: string }) => {
    const bgColors: Record<string, string> = {
      blue: 'bg-blue-50',
      purple: 'bg-purple-50',
      green: 'bg-green-50',
      orange: 'bg-orange-50'
    };
    
    const textColors: Record<string, string> = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600'
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${bgColors[accent]}`}>
            <div className={textColors[accent]}>{icon}</div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  const SectionCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="min-h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Profile</h1>
                    <p className="text-gray-600">Manage your fitness and health information</p>
                    <p className="text-sm text-gray-500 mt-1">Keep your details up to date. If there are any changes in your life or fitness journey, please update your information.</p>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2 self-start lg:self-auto" onClick={()=> navigate(FRONTEND_ROUTES.USER.PROFILE_PERSONAL_INFO_EDIT)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Profile
                  </button>
                </div>
                
                {/* Profile Status Banner */}
                {/* <div className={`mt-4 px-4 py-3 rounded-xl flex items-center gap-3 ${personalInfo.profileCompleted ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className={`w-2 h-2 rounded-full ${personalInfo.profileCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className={`font-medium ${personalInfo.profileCompleted ? 'text-green-800' : 'text-yellow-800'}`}>
                    {personalInfo.profileCompleted ? 'Profile Complete' : 'Profile Incomplete - Please update your information'}
                  </span>
                </div> */}
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <InfoCard 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  label="Age"
                  value={`${personalInfo.age} years`}
                  accent="blue"
                />
                <InfoCard 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  label="Gender"
                  value={personalInfo.gender.charAt(0).toUpperCase() + personalInfo.gender.slice(1)}
                  accent="purple"
                />
                <InfoCard 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>}
                  label="Height"
                  value={`${personalInfo.height} cm`}
                  accent="green"
                />
                <InfoCard 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
                  label="Current Weight"
                  value={`${personalInfo.weight} kg`}
                  accent="orange"
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Fitness Goals */}
                <SectionCard title="Fitness Goals">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-100">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Primary Goal</p>
                        <p className="text-lg font-semibold text-gray-900 capitalize">{personalInfo.fitnessGoal}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-100">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Target Weight</p>
                        <p className="text-lg font-semibold text-gray-900">{personalInfo.targetWeight} kg</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Progress to Goal</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((personalInfo.weight / personalInfo.targetWeight) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {Math.abs(personalInfo.targetWeight - personalInfo.weight)} kg to go
                        </span>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* Preferences */}
                <SectionCard title="Preferences & Experience">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Diet Preference</p>
                        <p className="font-semibold text-gray-900 capitalize">{personalInfo.dietPreference}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Experience Level</p>
                        <p className="font-semibold text-gray-900 capitalize">{personalInfo.experienceLevel}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Workout Location</p>
                        <p className="font-semibold text-gray-900 capitalize">{personalInfo.workoutLocation}</p>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* Workout Types & Medical Conditions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Preferred Workout Types">
                  <div className="flex flex-wrap gap-3">
                    {personalInfo.preferredWorkoutTypes.map((type, index) => (
                      <div key={index} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow capitalize flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {type}
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Medical Conditions">
                  {personalInfo.medicalConditions.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {personalInfo.medicalConditions.map((condition, index) => (
                        <div key={index} className="px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 rounded-lg font-medium capitalize flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          {condition}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-8 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-green-800 font-medium">No medical conditions reported</p>
                      </div>
                    </div>
                  )}
                </SectionCard>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalInfo;