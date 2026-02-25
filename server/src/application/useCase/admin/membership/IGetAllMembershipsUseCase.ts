import { MembershipAdminListResult } from "../../../dto/admin/subscription/MembershipDTO";

export interface IGetAllMembershipsUseCase {
    execute(
        page: number,
        limit: number,
        status?: string,
        search?: string
    ): Promise<MembershipAdminListResult>;
}