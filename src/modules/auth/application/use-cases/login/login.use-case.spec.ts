import * as bcrypt from 'bcrypt';

import { AuthService } from '@modules/auth/infrastructure/services';
import { FindUserByEmailUseCase } from '@modules/users/application/use-cases/find-user-by-email';
import { UserEntity, UserRole } from '@modules/users/domain/entities';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  let findUserByEmailMock: jest.Mock<Promise<UserEntity | null>, [{ email: string }]>;
  let authLoginMock: jest.Mock<Promise<string>, [UserEntity]>;
  let useCase: LoginUseCase;

  beforeEach(() => {
    findUserByEmailMock = jest.fn<Promise<UserEntity | null>, [{ email: string }]>();
    authLoginMock = jest.fn<Promise<string>, [UserEntity]>();

    useCase = new LoginUseCase(
      { execute: findUserByEmailMock } as unknown as FindUserByEmailUseCase,
      { login: authLoginMock } as unknown as AuthService,
    );
  });

  it('returns login auth data without exposing the password', async () => {
    const plainPassword = 'valid-password';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = buildUserEntity({ password: hashedPassword });
    findUserByEmailMock.mockResolvedValue(user);
    authLoginMock.mockResolvedValue('signed.jwt.token');

    const result = await useCase.execute({
      email: user.email,
      password: plainPassword,
    });

    expect(result).toEqual({ accessToken: 'signed.jwt.token' });
    expect(result).not.toHaveProperty('password');
    expect(JSON.stringify(result)).not.toContain(hashedPassword);
  });
});

function buildUserEntity(overrides: Partial<UserEntity> = {}): UserEntity {
  const user = new UserEntity();
  user.id = overrides.id ?? 1;
  user.email = overrides.email ?? 'user@example.com';
  user.password = overrides.password ?? '$2b$10$hashed-password';
  user.role = overrides.role ?? UserRole.USER;
  user.firstName = overrides.firstName;
  user.lastName = overrides.lastName;
  user.createdAt = overrides.createdAt ?? new Date('2026-01-01T00:00:00.000Z');
  user.updatedAt = overrides.updatedAt ?? null;
  user.deletedAt = overrides.deletedAt ?? null;
  return user;
}
