import { UserRole } from "@modules/users/domain/entities";

export class UserDto {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date | null;
}