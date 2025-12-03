import AxiosInstance from "../../../axios/axios";


export const getVerifiedTrainers = async (page=1,limit=10) => {
   const params = new URLSearchParams({
       page: String(page),
       limit: String(limit),
   });
   const response = await AxiosInstance.get(`/get-all-trainers?${params.toString()}`); 
   return response.data
};