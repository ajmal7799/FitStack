import { UserRole } from '../enum/userEnums';

export type JWTPayloadType = {
  userId: string;
  role: UserRole;
};