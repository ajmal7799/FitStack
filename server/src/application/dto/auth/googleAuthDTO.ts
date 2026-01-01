import { UserRole } from '../../../domain/enum/userEnums';

export interface IGoogleLoginRequestDTO {
  authorizationCode: string;
  role: UserRole;
}

export interface IGoogleLoginResponseDTO {
  email: string;
  name: string;
  _id: string;
  role: UserRole;
}