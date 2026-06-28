import { USER_ROLES, type User, type UserRoleValue } from '../models';

export const UserRole = USER_ROLES;

export type UserRole = UserRoleValue;

export class UserEntity implements User {
  id: number;

  email: string;

  password: string;

  role: UserRole;

  firstName?: string;

  lastName?: string;

  createdAt: Date;

  updatedAt: Date | null;

  deletedAt: Date | null;
}
