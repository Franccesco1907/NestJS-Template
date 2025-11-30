import { UserRole } from "@modules/users/domain/entities";

export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}

