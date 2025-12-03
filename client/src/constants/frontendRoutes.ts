export const FRONTEND_ROUTES = {
    LANDING:"/",

    USER:{
        SIGNUP: "/signup",
        LOGIN: "/login",
        FORGOTPASSWORD: "/forgot-password",
        HOME:"/home",
        SUBSCRIPTION:"/subscription",
        TRAINERS:"/trainers",
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