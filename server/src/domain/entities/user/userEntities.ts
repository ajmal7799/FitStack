import { UserRole,UserStatus } from '../../enum/userEnums';
export interface User {
    _id?: string;

    // Auth fields
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role: UserRole;
    googleId?: string;
    isActive: UserStatus;
    stripeCustomerId?: string;
    activeMembershipId?: string;

}