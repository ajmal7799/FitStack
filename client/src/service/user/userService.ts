import AxiosInstance from "../../axios/axios";


export const createUserProfile = async (formData: FormData) => {
    const response = await AxiosInstance.post("/profile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const getWorkoutPlan = async () => {
    const response = await AxiosInstance.get("/get-workout-plan");
    return response.data;
}

export const generateWorkoutPlan = async () => {
    const response = await AxiosInstance.post("/generate-workout-plan");
    return response.data;
}


export const getDietPlan = async () => {
    const response = await AxiosInstance.get("/get-diet-plan");
    return response.data;
}


export const generateDietPlan = async () => {
    const response = await AxiosInstance.post("/generate-diet-plan");
    return response.data;
}


export const getUserProfile = async () => {
    const response = await AxiosInstance.get("/profile");
    return response.data;
}


export const getPersonalInfo = async () => {
    const response = await AxiosInstance.get("/personal-info");
    return response.data;
}