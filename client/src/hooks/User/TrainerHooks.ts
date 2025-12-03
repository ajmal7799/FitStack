import {useQuery } from "@tanstack/react-query";
import { getVerifiedTrainers } from "../../service/user/subscription/TrainersService";


export const useGetAllVerifiedTrainers = (page: number, limit: number,) => {
    return useQuery({
       queryKey: ['trainer', page, limit],
       queryFn: () => getVerifiedTrainers(page, limit,),
       keepPreviousData: true,
       refetchInterval: 500,
    } as any);
}
