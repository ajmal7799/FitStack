export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/signup",
    VERIFY_OTP: "/verify-otp",
    RESEND_OTP: "/resend-otp",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    FORGOT_PASSWORD_VERIFY_OTP: "/forget-password/verify-otp",
    FORGOT_PASSWORD_RESET_PASSWORD: "/forget-password/reset-password",
    LOGOUT: "/logout",
    GOOGLE_LOGIN: "/google-login",
  },

  USER: {
    PROFILE: "/profile",
    GET_PROFILE: "/profile",
    UPDATE_PROFILE: "/profile-update",
    GET_PROFILE_PERSONAL_INFO: "/personal-info",
    UPDATE_PROFILE_PERSONAL_INFO: "/personal-info-update",
    GET_TRAINER_DETAILS: "/get-trainer-details",

    GET_AVAILABLE_SLOTS: "/get-available-slots/",
    BOOK_SLOT: "/book-slot",
    GET_BOOKED_SLOTS: "/booked-slots",
    GET_BOOKED_SLOT_DETAILS: "/booked-slots",
    CANCEL_BOOKED_SLOT: "/booked-slots",
    SESSION_HISTORY: "/sessions-history",
    SESSION_HISTORY_DETAILS: "/session-history",
    FEEDBACK: "/feedback",


    GET_WORKOUT_PLAN: "/get-workout-plan",
    GENERATE_WORKOUT_PLAN: "/generate-workout-plan",
    GET_DIET_PLAN: "/get-diet-plan",
    GENERATE_DIET_PLAN: "/generate-diet-plan",

    SELECT_TRAINER: "/select-trainer",
    GET_SELECTED_TRAINER: "/get-selected-trainer",
    GET_VERIFIED_TRAINERS: "/get-all-trainers",

    GET_NOTIFICATIONS: "/notifications",
    MARK_AS_READ: "/notifications",
    MARK_ALL_AS_READ: "/notifications/read-all",
    CLEAR_ALL_NOTIFICATIONS: "/notifications",

    GET_WALLET: "/wallet",

    VIDEO_SESSION: "/video-session/join",

    CHANGE_PASSWORD: "/change-password",
  },

  TRAINER: {
    GET_DASHBOARD: "/trainer/dashboard/stats",
    GET_DASHBOARD_CHARTS: "/trainer/dashboard/charts",

    VERIFICATION: "/trainer/verification",
    GET_VERIFICATION_PAGE: "/trainer/get-verification",

    GET_PROFILE: "/trainer/profile",
    UPDATE_PROFILE: "/trainer/profile-update",

    CREATE_SLOT: "/trainer/slots",
    GET_SLOTS: "/trainer/get-slots",
    DELETE_SLOT: "/trainer/slots",
    CREATE_RECURRING_SLOT: "/trainer/recurring-slots",
    GET_BOOKED_SLOTS: "/trainer/booked-slots",
    GET_BOOKED_SLOT_DETAILS: "/trainer/booked-slots",
    GET_SESSION_HISTORY: "/trainer/sessions-history",
    GET_SESSION_HISTORY_DETAILS: "/trainer/session-history",
  },

  ADMIN: {
    LOGIN: "admin/login",

    USERS: "/admin/users",
    USERS_UPDATE_STATUS: "/admin/users/update-status",

    TRAINERS: "/admin/trainers",
    TRAINERS_UPDATE_STATUS: "/admin/trainers/update-status",
    GET_TRAINER_DETAILS: "/admin/trainers",

    GET_ALL_VERIFICATION: "/admin/verification",
    GET_VERIFICATION_DETAILS: "/admin/verifications/",
    APPROVE_VERIFICATION: "/admin/verifications",
    REJECT_VERIFICATION: "/admin/verifications",

    GETSUBSCRIPTION: "/admin/subscriptions",
    CREATE_SUBSCRIPTION: "/admin/subscription",
    UPDATE_SUBSCRIPTION_STATUS: "/admin/subscriptions/update-status",
    GET_SUBSCRIPTION_EDIT_PAGE: "/admin/subscriptions/",
    UPDATE_SUBSCRIPTION: "/admin/subscriptions/",

    GET_SESSION: "/admin/sessions",
    GET_SESSION_DETAILS: "/admin/sessions",

    GET_MEMBERSHIP: "/admin/memberships",

    GET_REVENUE: "/admin/revenue",

    GET_DASHBOARD: "/admin/dashboard/stats",
    GET_DASHBOARD_CHARTS: "/admin/dashboard/charts",
  },

  CHAT: {
    INTIATE_CHAT: "/chat/initiate",
    INTIATE_CHAT_TRAINER: "/chat/initiatetrainer",
    GET_MESSAGES: "/chat/messages",
    MARK_AS_READ: "/chat/mark-as-read",
    GET_ATTACHMENT_UPLOAD_URL: "/chat/attachment/upload-url",
  },

  SUBSCRIPTION: {
    GET_SUBSCRIPTIONS: "/subscriptions",
    CHECKOUT_SESSION: "/checkout-session",
    GET_ACTIVE_SUBSCRIPTION: "/active-subscription",
  },
};
