import type { User } from '../models';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface CreateUserInput {
  email: string;
  password: string;
  role: User['role'];
  firstName?: string;
  lastName?: string;
}

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
}

export type UserRepositoryInterface = UserRepositoryPort;
