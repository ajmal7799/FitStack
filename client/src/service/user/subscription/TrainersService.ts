import AxiosInstance from '../../../axios/axios';


export const getVerifiedTrainers = async (page=1,limit=10,search?:string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if(search) params.append('search', search);
  const response = await AxiosInstance.get(`/get-all-trainers?${params.toString()}`); 
  return response.data;
};