// application/dto/revenue/revenueDTO.ts

export interface RevenueTransactionDTO {
    sessionId:   string;
    userName:    string;
    trainerName: string;
    sessionDate: Date;
    sessionRate: number;   // total ₹100
    platformCut: number;   // admin 20% ₹20
    trainerCut:  number;   // trainer 80% ₹80
}

export interface RevenueStatsDTO {
    totalRevenue:     number;
    thisMonthRevenue: number;
    totalSessions:    number;
    avgPerSession:    number;
}

export interface RevenueListingDTO {
    transactions:      RevenueTransactionDTO[];
    totalTransactions: number;
    totalPages:        number;
    currentPage:       number;
    stats:             RevenueStatsDTO;
}