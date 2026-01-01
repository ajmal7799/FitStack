import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  getAllVerification,
  getVerificationDetails,
  approveVerification,
  rejectVerification
} from '../../service/admin/AdminService';

export const useGetAllVerifications = (page: number, limit: number, status?: string, search?: string) => {
  return useQuery({
    queryKey: ['verification', page, limit, status, search],
    queryFn: () => getAllVerification(page, limit, status, search),
    keepPreviousData: true,
    refetchInterval: 500,

  } as any);
};

export const useGetVerificationDetail = (id: string) => {
  return useQuery({
    queryKey: ['verification', id],
    queryFn: () => getVerificationDetails(id),
    keepPreviousData: true,
    refetchInterval: 500,
  } as any);
};

export const useApproveVerification = () => {
  return useMutation({
    mutationFn:(id: string) => approveVerification(id)
  });
};

export const useRejectVerification = () => {
  return useMutation({
    mutationFn:({id, reason}: {id: string, reason: string}) => 
      rejectVerification(id, reason)
  });
};