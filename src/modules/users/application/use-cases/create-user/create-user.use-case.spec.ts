import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

import { UserEntity, UserRole } from '@modules/users/domain/entities';
import { UserRepositoryInterface } from '@modules/users/domain/repositories';
import { CreateUserUseCase } from './create-user.use-case';

type CreateInput = Parameters<UserRepositoryInterface['create']>[0];

describe('CreateUserUseCase', () => {
  const plainPassword = 'secure-password';

  let createMock: jest.Mock<Promise<UserEntity>, [CreateInput]>;
  let findByEmailMock: jest.Mock<Promise<UserEntity | null>, [string]>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    createMock = jest.fn<Promise<UserEntity>, [CreateInput]>();
    findByEmailMock = jest.fn<Promise<UserEntity | null>, [string]>();

    const userRepository = {
      create: createMock,
      findByEmail: findByEmailMock,
    } as unknown as UserRepositoryInterface;

    useCase = new CreateUserUseCase(userRepository);
  });

  it('creates public users with the default non-admin role and without returning password', async () => {
    findByEmailMock.mockResolvedValue(null);
    createMock.mockImplementation(async (input) =>
      buildUserEntity({
        email: String(input.email),
        password: String(input.password),
        role: input.role as UserRole,
        firstName: input.firstName as string | undefined,
        lastName: input.lastName as string | undefined,
      }),
    );

    const result = await useCase.execute({
      email: 'user@example.com',
      password: plainPassword,
      firstName: 'Template',
      lastName: 'User',
    });

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        role: UserRole.USER,
        firstName: 'Template',
        lastName: 'User',
      }),
    );
    expect(result.role).toBe(UserRole.USER);
    expect(result).not.toHaveProperty('password');
  });

  it('ignores role values supplied by public registration input', async () => {
    findByEmailMock.mockResolvedValue(null);
    createMock.mockImplementation(async (input) =>
      buildUserEntity({
        email: String(input.email),
        password: String(input.password),
        role: input.role as UserRole,
      }),
    );

    const requestWithRole = {
      email: 'attacker@example.com',
      password: plainPassword,
      role: UserRole.ADMIN,
    } as unknown as Parameters<CreateUserUseCase['execute']>[0];

    const result = await useCase.execute(requestWithRole);

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        role: UserRole.USER,
      }),
    );
    expect(createMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        role: UserRole.ADMIN,
      }),
    );
    expect(result.role).toBe(UserRole.USER);
    expect(result).not.toHaveProperty('password');
  });

  it('hashes the password before persisting a user', async () => {
    findByEmailMock.mockResolvedValue(null);
    createMock.mockImplementation(async (input) =>
      buildUserEntity({
        email: String(input.email),
        password: String(input.password),
        role: input.role as UserRole,
      }),
    );

    await useCase.execute({
      email: 'hashed@example.com',
      password: plainPassword,
    });

    const persistedInput = createMock.mock.calls[0][0];
    expect(persistedInput.password).not.toBe(plainPassword);
    await expect(bcrypt.compare(plainPassword, String(persistedInput.password))).resolves.toBe(true);
  });

  it('rejects duplicate email addresses before hashing or persisting', async () => {
    findByEmailMock.mockResolvedValue(buildUserEntity({ email: 'user@example.com' }));

    await expect(
      useCase.execute({
        email: 'user@example.com',
        password: plainPassword,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(createMock).not.toHaveBeenCalled();
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
