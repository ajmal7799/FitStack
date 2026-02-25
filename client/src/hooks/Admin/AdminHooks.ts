import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  getAllVerification,
  getVerificationDetails,
  approveVerification,
  rejectVerification,
  getSessionHistory,
  getSessionHistoryDetails,
  getMembershipPage
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


export const useGetSessionAdminHistory = (page: number, limit: number, status?: string, search?: string) => {
  return useQuery({
    queryKey: ['session-history', page, limit, status, search],
    queryFn: () => getSessionHistory(page, limit, status, search),
  } );
};


export const useGetSessionAdminHistoryDetail = (sessionId: string) => {
  return useQuery({
    queryKey: ['session-history', sessionId],
    queryFn: () => getSessionHistoryDetails(sessionId),
  } );
};



export const useGetMembershipPage = (page: number, limit: number, status?: string, search?: string) => {
  return useQuery({
    queryKey: ['membership', page, limit, status, search],
    queryFn: () => getMembershipPage(page, limit, status, search),
  } );
};