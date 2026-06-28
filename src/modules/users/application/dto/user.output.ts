import type { User } from '@modules/users/domain/models';

export interface UserOutput {
  id: number;
  email: string;
  role: User['role'];
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date | null;
}
