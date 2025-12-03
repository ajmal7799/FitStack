import AxiosInstance from "../../axios/axios";

export const getAllVerification = async (
    page = 1,
    limit = 10,
    status?: string,
    search?: string,

) => {
     const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if(status) params.append("status",status);
  if(search) params.append("search", search);

  const response = await AxiosInstance.get(`/admin/verification?${params.toString()}`);
  return response.data
}

export const getVerificationDetails = async (id: string) => {
  const response = await AxiosInstance.get(`/admin/verifications/${id}`);
  return (response.data as any).data.verificationData;
};

export const approveVerification = async (id: string) => {
  const response = await AxiosInstance.patch(`/admin/verifications/${id}/approve`);
  return response.data;
};


export const rejectVerification = async (id: string, reason: string) => {
  const response = await AxiosInstance.patch(`/admin/verifications/${id}/reject`, { reason });
  return response.data;
};