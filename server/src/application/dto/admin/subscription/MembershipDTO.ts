export interface MembershipAdminResult {
    _id: string;
    userName: string;
    profileImage: string | null;
    planName: string;
    price: number;
    status: string;
    currentPeriodEnd: Date | null;
    durationMonths: number;
}

export interface MembershipAdminListResult {
    memberships: MembershipAdminResult[];
    totalMemberships: number;
    totalPages: number;
    currentPage: number;
}