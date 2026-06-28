export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  DOCTOR: 'doctor',
} as const;

export type UserRoleValue = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRoleValue;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
