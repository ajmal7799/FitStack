export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  
};

export type OtpPayload = {
  email: string;
  otp: string;
};

export type LoginPayload = { 
  email: string;
  password: string;   
};

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string
  isActive: 'ACTIVE' | 'BLOCKED';
}

export interface IUserPagination {
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}

export interface IUserDataWrapper {
  data: IUserPagination;
}

export interface IGetAllUsersResponse {
  success: boolean;
  message: string;
  data: IUserDataWrapper;
}