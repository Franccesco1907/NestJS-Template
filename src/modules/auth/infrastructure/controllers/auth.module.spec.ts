import { TOKEN_ISSUER } from '@modules/auth/application/ports';
import { LoginUseCase } from '@modules/auth/application/use-cases/login';
import { PASSWORD_HASHER, type PasswordHasherPort } from '@modules/users/application/ports';
import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user';
import { FindUserByEmailUseCase } from '@modules/users/application/use-cases/find-user-by-email';
import { UserEntity, UserRole } from '@modules/users/domain/entities';
import { USER_REPOSITORY, type UserRepositoryInterface } from '@modules/users/domain/repositories';
import { UserOrmEntity } from '@modules/users/infrastructure/persistence/typeorm';
import { BcryptPasswordHasherService } from '@modules/users/infrastructure/services';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../services';
import { AuthModule } from './auth.module';

describe('AuthModule explicit provider wiring', () => {
  it('wires undecorated use cases through factories and binds the password hasher adapter', async () => {
    const userRepository = buildUserRepository();

    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(UserOrmEntity))
      .useValue({})
      .overrideProvider(ConfigService)
      .useValue(buildConfigService())
      .overrideProvider(USER_REPOSITORY)
      .useValue(userRepository)
      .compile();

    const createUserUseCase = moduleRef.get(CreateUserUseCase);
    const findUserByEmailUseCase = moduleRef.get(FindUserByEmailUseCase);
    const loginUseCase = moduleRef.get(LoginUseCase);
    const passwordHasher = moduleRef.get<PasswordHasherPort>(PASSWORD_HASHER);
    const tokenIssuer = moduleRef.get(TOKEN_ISSUER);

    expect(createUserUseCase).toBeInstanceOf(CreateUserUseCase);
    expect(findUserByEmailUseCase).toBeInstanceOf(FindUserByEmailUseCase);
    expect(loginUseCase).toBeInstanceOf(LoginUseCase);
    expect(passwordHasher).toBeInstanceOf(BcryptPasswordHasherService);
    expect(tokenIssuer).toBeInstanceOf(AuthService);
  });

  it('resolves login use cases with repository, token issuer, and password hasher dependencies', async () => {
    const storedUser = buildUserEntity({ password: 'hashed-password' });
    const userRepository = buildUserRepository({
      findByEmail: jest.fn().mockResolvedValue(storedUser),
    });
    const passwordHasher = { compare: jest.fn().mockResolvedValue(true) };
    const tokenIssuer = { issue: jest.fn().mockResolvedValue('signed.jwt.token') };

    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(UserOrmEntity))
      .useValue({})
      .overrideProvider(ConfigService)
      .useValue(buildConfigService())
      .overrideProvider(USER_REPOSITORY)
      .useValue(userRepository)
      .overrideProvider(PASSWORD_HASHER)
      .useValue(passwordHasher)
      .overrideProvider(TOKEN_ISSUER)
      .useValue(tokenIssuer)
      .compile();

    const loginUseCase = moduleRef.get(LoginUseCase);

    await expect(
      loginUseCase.execute({
        email: storedUser.email,
        password: 'plain-password',
      }),
    ).resolves.toEqual({ accessToken: 'signed.jwt.token' });
    expect(userRepository.findByEmail).toHaveBeenCalledWith(storedUser.email);
    expect(passwordHasher.compare).toHaveBeenCalledWith('plain-password', 'hashed-password');
    expect(tokenIssuer.issue).toHaveBeenCalledWith({
      userId: storedUser.id,
      email: storedUser.email,
      role: storedUser.role,
    });
  });
});

function buildUserRepository(
  overrides: Partial<jest.Mocked<UserRepositoryInterface>> = {},
): jest.Mocked<UserRepositoryInterface> {
  return {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    ...overrides,
  };
}

function buildConfigService(): Pick<ConfigService, 'get'> {
  return {
    get: jest.fn().mockReturnValue('test-jwt-secret'),
  };
}

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
