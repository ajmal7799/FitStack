export const API_ROUTES = {
  USER: {
    VERIFY_OTP: '/verify-otp',
    RESEND_OTP: '/resend-otp',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    FORGOT_PASSWORD_VERIFY_OTP: '/forget-password/verify-otp',
    FORGOT_PASSWORD_RESET_PASSWORD: '/forget-password/reset-password',
    LOGOUT: '/logout',
    GOOGLE_LOGIN: '/google-login',
  },

  ADMIN: {
    ADMIN_LOGIN: 'admin/login',
    ADMIN_USERS: '/admin/users',
    ADMIN_USERS_UPDATE_STATUS: '/admin/users/update-status',
    ADMIN_TRAINERS: '/admin/trainers',
    ADMIN_TRAINERS_UPDATE_STATUS: '/admin/trainers/update-status',
    GET_ALL_VERIFICATION: '/admin/verification',
    GET_VERIFICATION_DETAILS: '/admin/verifications',
    APPROVE_VERIFICATION: '/admin/verification/'
  },
};
