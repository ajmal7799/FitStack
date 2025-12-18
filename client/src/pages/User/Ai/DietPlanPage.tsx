import React, { useState } from 'react';
import { Calendar, UtensilsCrossed, Heart, Sparkles, RefreshCw, CheckCircle, Clock, Flame, Dumbbell, Droplets, Apple } from 'lucide-react';
import { useGetDietPlan, useGenerateDietPlan } from "../../../hooks/User/userServiceHooks";
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/footer';
import { useNavigate } from 'react-router-dom';

// Types
interface MealItem {
  time: string;
  items: string[];
  calories: string;
}

interface Meals {
  breakfast: MealItem;
  midMorningSnack: MealItem;
  lunch: MealItem;
  eveningSnack: MealItem;
  dinner: MealItem;
}

interface DayPlan {
  day: string;
  meals: Meals;
}

interface NutritionGuidelines {
  dailyCalories: string;
  proteinIntake: string;
  hydration: string;
  macroBalance: string;
  mealTiming: string;
}

interface ImportantNotes {
  hydrationTips?: string;
  foodsToAvoid?: string[];
}

interface WeeklyGuidance {
  adherence?: string;
  adjustments?: string;
  duration?: string;
  progressTracking?: string;
}

interface DietPlanResult {
  id: string;
  userId: string;
  weeklyDietPlan: DayPlan[];
  nutritionGuidelines?: NutritionGuidelines;
  importantNotes?: ImportantNotes;
  weeklyGuidance?: WeeklyGuidance;
  isActive: boolean;
}

interface DietPlanResponse {
  success: boolean;
  message: string;
  data: {
    result: DietPlanResult;
  };
}

const AiDietPlan: React.FC = () => {
  const { data, isLoading, isError,  } = useGetDietPlan();
  const { mutate: generatePlan, isPending: isGenerating, isError: isGenerateError, error: generateError } = useGenerateDietPlan();
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const navigate = useNavigate();

  const dietPlanResponse = data as DietPlanResponse | undefined;
  const dietPlan = dietPlanResponse?.data?.result;
  const hasDietPlan = data !== null && data !== undefined && dietPlanResponse?.success && dietPlan;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your diet plan...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl text-center">
            <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Nutrition Journey Today!</h2>
            <p className="text-gray-700 mb-3 text-lg">
              Good nutrition is the foundation of a healthy lifestyle. A personalized diet plan helps you reach your goals effectively.
            </p>
            <p className="text-gray-600 mb-6">
              Generate your AI-powered diet plan now and fuel your body with the right nutrition. Your health transformation starts here! 🥗
            </p>
            
            {/* Plan Type Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => navigate('/ai-workout')}
                className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition"
              >
                <Dumbbell className="w-5 h-5 inline-block mr-2" />
                Workout Plan
              </button>
              <button
                onClick={() => navigate('/ai-diet')}
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg border-2 border-emerald-600"
              >
                <UtensilsCrossed className="w-5 h-5 inline-block mr-2" />
                Diet Plan
              </button>
            </div>

            <button
              onClick={() => {
                generatePlan();
                setTimeout(() => window.location.reload(), 8000);
              }}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-lg hover:from-emerald-700 hover:to-green-700 transition flex items-center gap-2 mx-auto text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Diet Plan
                </>
              )}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Check if data is null (no diet plan exists in backend)
  if (!isLoading && data === null) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl text-center">
            <div className="bg-emerald-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Data Available</h2>
            <p className="text-gray-600 mb-4 text-lg">
              You haven't generated a diet plan yet.
            </p>
            <p className="text-gray-500 mb-6">
              Click the button below to generate a personalized AI-powered diet plan tailored specifically for your nutrition goals.
            </p>
            
            {/* Plan Type Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => navigate('/ai-workout')}
                className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition"
              >
                <Dumbbell className="w-5 h-5 inline-block mr-2" />
                Workout Plan
              </button>
              <button
                onClick={() => navigate('/ai-diet')}
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg border-2 border-emerald-600"
              >
                <UtensilsCrossed className="w-5 h-5 inline-block mr-2" />
                Diet Plan
              </button>
            </div>

            <button
              onClick={() => {
                generatePlan();
                setTimeout(() => window.location.reload(), 8000);
              }}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-lg hover:from-emerald-700 hover:to-green-700 transition flex items-center gap-2 mx-auto text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Diet Plan
                </>
              )}
            </button>
            {isGenerateError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {(generateError as any)?.response?.data?.message || 
                   (generateError as any)?.message || 
                   'Failed to generate diet plan. Please try again.'}
                </p>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!hasDietPlan || !dietPlan?.weeklyDietPlan || dietPlan.weeklyDietPlan.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl text-center">
            <div className="bg-emerald-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">You Haven't Generated a Diet Plan Yet</h2>
            <p className="text-gray-600 mb-4 text-lg">
              It looks like you don't have a diet plan yet. Let's create one!
            </p>
            <p className="text-gray-500 mb-6">
              Click the button below to generate a personalized AI-powered diet plan tailored specifically for your nutrition and health goals.
            </p>
            
            {/* Plan Type Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={() => navigate('/ai-workout')}
                className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition"
              >
                <Dumbbell className="w-5 h-5 inline-block mr-2" />
                Workout Plan
              </button>
              <button
                onClick={() => navigate('/ai-diet')}
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg border-2 border-emerald-600"
              >
                <UtensilsCrossed className="w-5 h-5 inline-block mr-2" />
                Diet Plan
              </button>
            </div>

            <button
              onClick={() => {
                generatePlan();
                setTimeout(() => window.location.reload(), 8000);
              }}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-lg hover:from-emerald-700 hover:to-green-700 transition flex items-center gap-2 mx-auto text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Diet Plan
                </>
              )}
            </button>
            {isGenerateError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {(generateError as any)?.response?.data?.message || 
                   (generateError as any)?.message || 
                   'Failed to generate diet plan. Please try again.'}
                </p>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentDay = dietPlan.weeklyDietPlan?.[selectedDay];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your AI Diet Plan</h1>
                <p className="text-gray-600">Personalized nutrition program designed for your goals</p>
              </div>
              <div className="flex gap-3">
                {/* Plan Type Buttons */}
                <button
                  onClick={() => navigate('/ai-workout')}
                  className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition text-sm"
                >
                  <Dumbbell className="w-4 h-4 inline-block mr-1" />
                  Workout Plan
                </button>
                <button
                  onClick={() => navigate('/ai-diet')}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg border-2 border-emerald-600 text-sm"
                >
                  <UtensilsCrossed className="w-4 h-4 inline-block mr-1" />
                  Diet Plan
                </button>
                <button
                  onClick={() => {
                    generatePlan();
                    setTimeout(() => window.location.reload(), 8000);
                  }}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>

          {/* Nutrition Guidelines */}
          {dietPlan.nutritionGuidelines && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  Daily Nutrition Guidelines
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Daily Calories</span>
                    <span className="text-emerald-600 font-bold">{dietPlan.nutritionGuidelines.dailyCalories}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Protein Intake</span>
                    <span className="text-emerald-600 font-bold">{dietPlan.nutritionGuidelines.proteinIntake}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Hydration</span>
                    <span className="text-emerald-600 font-bold">{dietPlan.nutritionGuidelines.hydration}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-gray-600 font-medium">Macro Balance:</span>
                    <p className="text-sm text-gray-700 mt-1">{dietPlan.nutritionGuidelines.macroBalance}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Meal Timing
                </h3>
                <p className="text-emerald-50">{dietPlan.nutritionGuidelines.mealTiming}</p>
              </div>
            </div>
          )}

          {/* Weekly Diet Plan */}
          {dietPlan.weeklyDietPlan && dietPlan.weeklyDietPlan.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="w-7 h-7 text-emerald-600" />
                Weekly Meal Schedule
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                {dietPlan.weeklyDietPlan.map((day: DayPlan, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`p-4 rounded-xl transition ${
                      selectedDay === index
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg'
                        : 'bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className={`text-sm font-semibold ${selectedDay === index ? 'text-white' : 'text-gray-800'}`}>
                      {day.day}
                    </div>
                  </button>
                ))}
              </div>

              {/* Day Details */}
              {currentDay && (
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">{currentDay.day} - Meal Plan</h3>

                  {/* Breakfast */}
                  <div className="mb-6 bg-yellow-50 rounded-xl p-5 border-2 border-yellow-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                        <Apple className="w-5 h-5" />
                        Breakfast
                      </h4>
                      <span className="text-sm font-semibold text-yellow-700">{currentDay.meals.breakfast.time}</span>
                    </div>
                    <ul className="space-y-2 mb-3">
                      {currentDay.meals.breakfast.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold text-yellow-700">{currentDay.meals.breakfast.calories}</p>
                  </div>

                  {/* Mid Morning Snack */}
                  <div className="mb-6 bg-green-50 rounded-xl p-5 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-green-800">Mid-Morning Snack</h4>
                      <span className="text-sm font-semibold text-green-700">{currentDay.meals.midMorningSnack.time}</span>
                    </div>
                    <ul className="space-y-2 mb-3">
                      {currentDay.meals.midMorningSnack.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold text-green-700">{currentDay.meals.midMorningSnack.calories}</p>
                  </div>

                  {/* Lunch */}
                  <div className="mb-6 bg-orange-50 rounded-xl p-5 border-2 border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-orange-800 flex items-center gap-2">
                        <UtensilsCrossed className="w-5 h-5" />
                        Lunch
                      </h4>
                      <span className="text-sm font-semibold text-orange-700">{currentDay.meals.lunch.time}</span>
                    </div>
                    <ul className="space-y-2 mb-3">
                      {currentDay.meals.lunch.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold text-orange-700">{currentDay.meals.lunch.calories}</p>
                  </div>

                  {/* Evening Snack */}
                  <div className="mb-6 bg-teal-50 rounded-xl p-5 border-2 border-teal-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-teal-800">Evening Snack</h4>
                      <span className="text-sm font-semibold text-teal-700">{currentDay.meals.eveningSnack.time}</span>
                    </div>
                    <ul className="space-y-2 mb-3">
                      {currentDay.meals.eveningSnack.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold text-teal-700">{currentDay.meals.eveningSnack.calories}</p>
                  </div>

                  {/* Dinner */}
                  <div className="bg-indigo-50 rounded-xl p-5 border-2 border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Dinner
                      </h4>
                      <span className="text-sm font-semibold text-indigo-700">{currentDay.meals.dinner.time}</span>
                    </div>
                    <ul className="space-y-2 mb-3">
                      {currentDay.meals.dinner.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold text-indigo-700">{currentDay.meals.dinner.calories}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Important Notes & Weekly Guidance */}
          <div className="grid md:grid-cols-2 gap-6">
            {dietPlan.importantNotes && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Droplets className="w-6 h-6 text-blue-500" />
                  Important Notes
                </h3>
                {dietPlan.importantNotes.hydrationTips && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Hydration Tips:</h4>
                    <p className="text-sm text-gray-600">{dietPlan.importantNotes.hydrationTips}</p>
                  </div>
                )}
                {dietPlan.importantNotes.foodsToAvoid && dietPlan.importantNotes.foodsToAvoid.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Foods to Avoid:</h4>
                    <ul className="space-y-1">
                      {dietPlan.importantNotes.foodsToAvoid.map((food: string, index: number) => (
                        <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                          <span>❌</span>
                          <span>{food}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {dietPlan.weeklyGuidance && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Guidance</h3>
                <div className="space-y-4">
                  {dietPlan.weeklyGuidance.adherence && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Adherence:</h4>
                      <p className="text-sm text-gray-600">{dietPlan.weeklyGuidance.adherence}</p>
                    </div>
                  )}
                  {dietPlan.weeklyGuidance.adjustments && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Adjustments:</h4>
                      <p className="text-sm text-gray-600">{dietPlan.weeklyGuidance.adjustments}</p>
                    </div>
                  )}
                  {dietPlan.weeklyGuidance.duration && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Duration:</h4>
                      <p className="text-sm text-gray-600">{dietPlan.weeklyGuidance.duration}</p>
                    </div>
                  )}
                  {dietPlan.weeklyGuidance.progressTracking && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Progress Tracking:</h4>
                      <p className="text-sm text-gray-600">{dietPlan.weeklyGuidance.progressTracking}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AiDietPlan;