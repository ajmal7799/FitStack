import { User } from '../../domain/entities/user/userEntities';
import { UserRole, UserStatus } from '../../domain/enum/userEnums';
import { IUserModel } from '../../infrastructure/database/models/userModel';
import { CreateUserDTO } from '../dto/auth/createUserDTO';
import mongoose, { Mongoose } from 'mongoose';
import { LoginUserDTO } from '../dto/auth/LoginUserDTO';
import { UserDTO } from '../dto/user/userDTO';

export class UserMapper {
  static toEntity(dto: CreateUserDTO): User {
    return {
      _id: new mongoose.Types.ObjectId().toString(),
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: dto.role,
      isActive: UserStatus.ACTIVE,
      googleId: '',
      stripeCustomerId: undefined,
      activeMembershipId: undefined,

      // profileCompleted: false,
    };
  }

  static toDTO(entity: User): UserDTO {
    return {
      _id: entity._id!,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      role: entity.role,
      isActive: entity.isActive,
    };
  }

  static toLoginUserResponse(user: User, verificationCheck: boolean = true, userProfileCompleted: boolean = true): LoginUserDTO {
    return {
      _id: user._id!,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      verificationCheck,
      userProfileCompleted,
    };
  }

  static toLoginAdminResponse(user: User): LoginUserDTO {
    return {
      _id: user._id!,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }

  static toMongooseDocument(user: User) {
    return {
      _id: new mongoose.Types.ObjectId(user._id),
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      stripeCustomerId: user.stripeCustomerId,
      activeMembershipId: user.activeMembershipId,
    };
  }

  static fromMongooseDocument(doc: IUserModel): User {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      phone: doc.phone,
      role: doc.role,
      isActive: doc.isActive || UserStatus.ACTIVE,
      stripeCustomerId: doc.stripeCustomerId,
      activeMembershipId: doc.activeMembershipId,
    };
  }
}
