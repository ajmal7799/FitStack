import React, { useState } from 'react';
import { Calendar, Dumbbell, Heart, AlertCircle, Sparkles, RefreshCw, CheckCircle, Clock, Flame,Utensils } from 'lucide-react';
import { useGetWorkoutPlan, useGenerateWorkoutPlan } from '../../../hooks/User/userServiceHooks';
import { useNavigate } from 'react-router-dom';
// Import Header and Footer
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/footer';

// Types (unchanged)
interface Exercise {
  exerciseName: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

interface WarmupCooldown {
  duration: string;
  exercises: string[];
}

interface DayPlan {
  day: string;
  focus: string;
  isRestDay: boolean;
  warmup?: WarmupCooldown;
  mainWorkout?: Exercise[];
  cooldown?: WarmupCooldown;
}

interface ImportantNotes {
  safetyTips?: string[];
  restAndRecovery?: string;
  nutrition?: string;
  hydration?: string;
  whenToStopExercising?: string[];
}

interface WorkoutPlanResult {
  id: string;
  userId: string;
  weeklyPlan: DayPlan[];
  importantNotes?: ImportantNotes;
  equipmentNeeded?: string[];
  expectedResults?: string;
  isActive: boolean;
}

interface WorkoutPlanResponse {
  success: boolean;
  message: string;
  data: {
    result: WorkoutPlanResult;
  };
}

const AiWorkoutPlan: React.FC = () => {
  const { data, isLoading, isError } = useGetWorkoutPlan();
  const { mutate: generatePlan, isPending: isGenerating, isError: isGenerateError, error: generateError } = useGenerateWorkoutPlan();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const navigate = useNavigate();

  const workoutPlanResponse = data as WorkoutPlanResponse | undefined;
  const workoutPlan = workoutPlanResponse?.data?.result;
  const hasWorkoutPlan = data !== null && data !== undefined && workoutPlanResponse?.success && workoutPlan;

  // Loading State
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your workout plan...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error State (no plan yet or fetch error)
  if (isError || (!isLoading && data === null) || (!hasWorkoutPlan || !workoutPlan?.weeklyPlan || workoutPlan.weeklyPlan.length === 0)) {
    return (
      <>
        <Header />

        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">

            {/* Navigation Buttons - Workout Plan (active) & Diet Plan */}
            <div className="mb-8 flex justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg text-lg flex items-center gap-3">
                <Dumbbell className="w-6 h-6" />
              Workout Plan
              </button>
              <button
                onClick={() => navigate('/ai-diet')}
                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg text-lg border-2 border-indigo-200 hover:border-indigo-400 transition flex items-center gap-3"
              >
                <Utensils className="w-6 h-6" />
              Diet Plan
              </button>
            </div>

            {/* Main Content Card */}
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
                <div className="bg-indigo-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="w-12 h-12 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {isError ? 'Start Your Fitness Journey Today!' : "You Haven't Generated a Workout Plan Yet"}
                </h2>
                <p className="text-gray-600 mb-4 text-lg">
                  {isError
                    ? 'Every fitness journey begins with a single step. A well-structured workout plan is your roadmap to success.'
                    : "It looks like you don't have a workout plan yet. Let's create one!"
                  }
                </p>
                <p className="text-gray-500 mb-8">
                Click the button below to generate a personalized AI-powered workout plan tailored specifically for your fitness goals.
                </p>

                <button
                  onClick={() => generatePlan()}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-2 mx-auto text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                    Generate Workout Plan
                    </>
                  )}
                </button>

                {isGenerateError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      {(generateError as any)?.response?.data?.message ||
                     (generateError as any)?.message ||
                     'Failed to generate workout plan. Please try again.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  const currentDay = workoutPlan.weeklyPlan?.[selectedDay];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg text-lg flex items-center gap-3">
              <Dumbbell className="w-6 h-6" />
    Workout Plan
            </button>
            <button
              onClick={() => navigate('/ai-diet')}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg text-lg border-2 border-indigo-200 hover:border-indigo-400 transition flex items-center gap-3"
            >
              <Utensils className="w-6 h-6" />
    Diet Plan
            </button>
          </div>
          {/* Header Section inside content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your AI Workout Plan</h1>
                <p className="text-gray-600">Personalized training program designed for your goals</p>
              </div>
              <button
                onClick={() => generatePlan()}
                disabled={isGenerating}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Regenerate Plan
                  </>
                )}
              </button>
            </div>
          </div>

         

          {/* Equipment & Expected Results */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {workoutPlan.equipmentNeeded && workoutPlan.equipmentNeeded.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-indigo-600" />
                  Equipment Needed
                </h3>
                <ul className="space-y-2">
                  {workoutPlan.equipmentNeeded.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {workoutPlan.expectedResults && (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Flame className="w-6 h-6" />
                  Expected Results
                </h3>
                <p className="text-indigo-100">{workoutPlan.expectedResults}</p>
              </div>
            )}
          </div>

          {/* Weekly Plan */}
          {workoutPlan.weeklyPlan && workoutPlan.weeklyPlan.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="w-7 h-7 text-indigo-600" />
                Weekly Schedule
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                {workoutPlan.weeklyPlan.map((day: DayPlan, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`p-4 rounded-xl transition ${
                      day.isRestDay
                        ? 'bg-gray-100 border-2 border-gray-300'
                        : selectedDay === index
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                          : 'bg-indigo-50 border-2 border-indigo-200 hover:border-indigo-400'
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">{day.day}</div>
                    <div className={`text-xs ${day.isRestDay ? 'text-gray-500' : selectedDay === index ? 'text-indigo-100' : 'text-indigo-600'}`}>
                      {day.focus}
                    </div>
                  </button>
                ))}
              </div>

              {/* Day Details */}
              {currentDay && (
                <div className="border-t-2 border-gray-200 pt-6">
                  {currentDay.isRestDay ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Rest Day</h3>
                      <p className="text-gray-600">Take this day to recover and let your muscles repair. Stay hydrated and get good sleep!</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {currentDay.day} - {currentDay.focus}
                      </h3>

                      {/* Warmup */}
                      {currentDay.warmup?.exercises && currentDay.warmup.exercises.length > 0 && (
                        <div className="mb-6 bg-orange-50 rounded-xl p-5">
                          <h4 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Warmup ({currentDay.warmup.duration})
                          </h4>
                          <ul className="space-y-2">
                            {currentDay.warmup.exercises.map((exercise: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-orange-600 font-bold">•</span>
                                <span className="text-gray-700">{exercise}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Main Workout */}
                      {currentDay.mainWorkout && currentDay.mainWorkout.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-indigo-600" />
                            Main Workout
                          </h4>
                          <div className="space-y-4">
                            {currentDay.mainWorkout.map((exercise: Exercise, idx: number) => (
                              <div key={idx} className="bg-indigo-50 rounded-xl p-5 border-2 border-indigo-200">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-bold text-gray-800 text-lg">{exercise.exerciseName}</h5>
                                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {exercise.sets} × {exercise.reps}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Rest: {exercise.rest}</p>
                                {exercise.notes && (
                                  <p className="text-sm text-gray-700 italic">{exercise.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cooldown */}
                      {currentDay.cooldown?.exercises && currentDay.cooldown.exercises.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-5">
                          <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            Cooldown ({currentDay.cooldown.duration})
                          </h4>
                          <ul className="space-y-2">
                            {currentDay.cooldown.exercises.map((exercise: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span className="text-gray-700">{exercise}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Important Notes */}
          {workoutPlan.importantNotes && (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  Safety Tips
                </h3>
                {workoutPlan.importantNotes.safetyTips && workoutPlan.importantNotes.safetyTips.length > 0 && (
                  <ul className="space-y-2">
                    {workoutPlan.importantNotes.safetyTips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {workoutPlan.importantNotes.whenToStopExercising && workoutPlan.importantNotes.whenToStopExercising.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-2">When to Stop Exercising:</h4>
                    <ul className="space-y-1">
                      {workoutPlan.importantNotes.whenToStopExercising.map((item: string, index: number) => (
                        <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                          <span>⚠️</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Guidelines</h3>
                <div className="space-y-4">
                  {workoutPlan.importantNotes.restAndRecovery && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Rest & Recovery</h4>
                      <p className="text-sm text-gray-600">{workoutPlan.importantNotes.restAndRecovery}</p>
                    </div>
                  )}
                  {workoutPlan.importantNotes.nutrition && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Nutrition</h4>
                      <p className="text-sm text-gray-600">{workoutPlan.importantNotes.nutrition}</p>
                    </div>
                  )}
                  {workoutPlan.importantNotes.hydration && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Hydration</h4>
                      <p className="text-sm text-gray-600">{workoutPlan.importantNotes.hydration}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AiWorkoutPlan;