import { RevenueListingDTO } from "../../../dto/revenue/revenueDTO";

export interface IGetRevenueListingUseCase {
    execute(page: number, limit: number,search?: string, startDate?: string, endDate?: string): Promise<RevenueListingDTO>;
}
