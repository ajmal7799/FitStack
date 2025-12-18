export const FRONTEND_ROUTES = {
    LANDING:"/",

    USER:{
        SIGNUP: "/signup",
        LOGIN: "/login",
        FORGOTPASSWORD: "/forgot-password",
        HOME:"/home",
        SUBSCRIPTION:"/subscription",
        TRAINERS:"/trainers",
        PAYMENT_SUCCESS:"/payment/success",
        PAYMENT_CANCEL:"/plans",
        ADD_PROFILE:"/add-profile",
        AI_WORKOUT:"/ai-workout",
        AI_DIET:"/ai-diet",
        PROFOILE:"/profile",
        PROFILE_PERSONAL_INFO:"/profile/personal-info",
    },


    TRAINER:{
        TRAINER_DASHBOARD:'/dashboard',
        TRAINER_VERIFICATION:'/verification',
        TRAINER_PROFILE:'/profile',
        TRAINER_GET_VERIFICATION:'/get-verification',
    },


    ADMIN: {
        LOGIN: "/login",
        DASHBOARD: "/dashboard",
        USERS: "/users",
        TRAINER: "/trainers",
        VERIFICATION: "/verification",
        VERIFICATION_DETAILS: "/verifications/:trainerId",
        SUBSCRIPTION_PLAN: "/subscriptions",
    },
}