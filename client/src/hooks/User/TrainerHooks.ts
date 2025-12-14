import {useQuery } from "@tanstack/react-query";
import { getVerifiedTrainers } from "../../service/user/subscription/TrainersService";


export const useGetAllVerifiedTrainers = (page: number, limit: number, search?: string) => {
    return useQuery({
       queryKey: ['trainer', page, limit, search],
       queryFn: () => getVerifiedTrainers(page, limit, search),
       keepPreviousData: true,
       refetchInterval: 500,
    } as any);
}
