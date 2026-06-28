import { InvalidCredentialsError } from '@modules/auth/application/errors';
import type { TokenIssuerPort } from '@modules/auth/application/ports';
import type { JwtPayload } from '@modules/auth/domain/entities';
import type { PasswordHasherPort } from '@modules/users/application/ports';
import { FindUserByEmailUseCase } from '@modules/users/application/use-cases/find-user-by-email';
import { UserEntity, UserRole } from '@modules/users/domain/entities';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  let findUserByEmailMock: jest.Mock<Promise<UserEntity | null>, [{ email: string }]>;
  let passwordCompareMock: jest.Mock<Promise<boolean>, [string, string]>;
  let tokenIssueMock: jest.Mock<Promise<string>, [JwtPayload]>;
  let useCase: LoginUseCase;

  beforeEach(() => {
    findUserByEmailMock = jest.fn<Promise<UserEntity | null>, [{ email: string }]>();
    passwordCompareMock = jest.fn<Promise<boolean>, [string, string]>();
    tokenIssueMock = jest.fn<Promise<string>, [JwtPayload]>();

    useCase = new LoginUseCase(
      { execute: findUserByEmailMock } as unknown as FindUserByEmailUseCase,
      { issue: tokenIssueMock } as unknown as TokenIssuerPort,
      { compare: passwordCompareMock } as unknown as PasswordHasherPort,
    );
  });

  it('returns login auth data without exposing the password', async () => {
    const plainPassword = 'valid-password';
    const hashedPassword = 'hashed-password';
    const user = buildUserEntity({ password: hashedPassword });
    findUserByEmailMock.mockResolvedValue(user);
    passwordCompareMock.mockResolvedValue(true);
    tokenIssueMock.mockResolvedValue('signed.jwt.token');

    const result = await useCase.execute({
      email: user.email,
      password: plainPassword,
    });

    expect(result).toEqual({ accessToken: 'signed.jwt.token' });
    expect(passwordCompareMock).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(tokenIssueMock).toHaveBeenCalledWith({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    expect(result).not.toHaveProperty('password');
    expect(JSON.stringify(result)).not.toContain(hashedPassword);
  });

  it('throws application invalid credentials error when the email is unknown', async () => {
    findUserByEmailMock.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'missing@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(passwordCompareMock).not.toHaveBeenCalled();
    expect(tokenIssueMock).not.toHaveBeenCalled();
  });

  it('throws application invalid credentials error when the password is invalid', async () => {
    const user = buildUserEntity({ password: 'hashed-password' });
    findUserByEmailMock.mockResolvedValue(user);
    passwordCompareMock.mockResolvedValue(false);

    await expect(
      useCase.execute({
        email: user.email,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(passwordCompareMock).toHaveBeenCalledWith('wrong-password', user.password);
    expect(tokenIssueMock).not.toHaveBeenCalled();
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
