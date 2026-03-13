import AxiosInstance from '../../axios/axios';
import { API_ROUTES } from '../../constants/apiRoutes';

export const getVerifiedTrainers = async (page=1,limit=10,search?:string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if(search) params.append('search', search);
  const response = await AxiosInstance.get(`${API_ROUTES.USER.GET_VERIFIED_TRAINERS}?${params.toString()}`); 
  return response.data;
};