import AxiosInstance from "../../axios/axios";

export const submitTrainerVerification = async (formData: FormData) => {
  const response = await AxiosInstance.post("/trainer/verification", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getProfilePage = async () => {
  const response = await AxiosInstance.get("/trainer/profile");
  return (response.data as any).data.profileData;
};

export const getVerificationPage = async () => {
  const response = await AxiosInstance.get("/trainer/get-verification");
  return (response.data as any).data.verificationData;
}
