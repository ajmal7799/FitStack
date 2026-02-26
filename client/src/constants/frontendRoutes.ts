export const FRONTEND_ROUTES = {
  LANDING:'/',

  USER:{
    SIGNUP: '/signup',
    LOGIN: '/login',
    FORGOTPASSWORD: '/forgot-password',
    HOME:'/home',
    SUBSCRIPTION:'/subscription',

    TRAINER_DETAILS: '/trainers/details/:trainerId',
    TRAINERS:'/trainers',
    SELECTED_TRAINER:'/selected-trainer',

    PAYMENT_SUCCESS:'/payment/success',
    PAYMENT_CANCEL:'/plans',
    ADD_PROFILE:'/add-profile',
    AI_WORKOUT:'/ai-workout',
    AI_DIET:'/ai-diet',
    PROFOILE:'/profile',
    PROFOILE_EDIT:'/profile-edit',
    PROFILE_PERSONAL_INFO:'/profile/personal-info',
    PROFILE_PERSONAL_INFO_EDIT:'/profile/personal-info-edit',
    CHANGE_PASSWORD:'/change-password',
    ACTIVE_SUBSCRIPTION:'/active-subscription',

    SLOT_BOOKING:'/slots-booking',
    SLOT_BOOKED:'/sessions',
    SLOT_BOOKED_DETAILS:'/sessions/:slotId',
    SESSION_HISTORY:'/sessions-history',
    SESSION_HISTORY_DETAILS:'/session-history/:sessionId',

    CHAT:'/chat',

    VIDEO_SESSION:'/video-session/:roomId/:slotId',

    WALLET:'/wallet',

  },


  TRAINER:{
    TRAINER_DASHBOARD:'/dashboard',
    TRAINER_VERIFICATION:'/verification',
    TRAINER_PROFILE:'/profile',
    TRAINER_PROFILE_EDIT:'/profile-edit',
    TRAINER_GET_VERIFICATION:'/get-verification',

    TRAINER_SLOT:'/slot',
    TRAINER_UPCOMING_SLOTS:'/upcoming-slots',
    TRAINER_UPCOMING_SLOT_DETAILS:'/upcoming-slots/:slotId',
    TRAINER_SESSION_HISTORY:'/sessions-history',
    TRAINER_SESSION_HISTORY_DETAILS:'/session-history/:sessionId',

    TRAINER_CHAT:'/chat',

    VIDEO_SESSION:'/video-session/:roomId/:slotId',

    TRAINER_CHANGE_PASSWORD:'/change-password',

    TRAINER_WALLET:'/wallet',
  },


  ADMIN: {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    USERS: '/users',
    TRAINER: '/trainers',
    VERIFICATION: '/verification',
    VERIFICATION_DETAILS: '/verifications/:trainerId',
    SUBSCRIPTION_PLAN: '/subscriptions',
    SESSION_HISTORY: '/sessions',
    SESSION_HISTORY_DETAILS: '/sessions/:sessionId',
    MEMBERSHIPS: '/memberships',
  },
};