import { InvalidCredentialsError } from '@modules/auth/application/errors';
import { LoginUseCase } from '@modules/auth/application/use-cases/login';
import { EmailAlreadyRegisteredError } from '@modules/users/application/errors';
import { UserRole } from '@modules/users/domain/entities';
import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user';
import { BadRequestException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let createUserUseCase: { execute: jest.Mock };
  let loginUseCase: { execute: jest.Mock };
  let controller: AuthController;

  beforeEach(() => {
    createUserUseCase = { execute: jest.fn() };
    loginUseCase = { execute: jest.fn() };

    controller = new AuthController(
      createUserUseCase as unknown as CreateUserUseCase,
      loginUseCase as unknown as LoginUseCase,
    );
  });

  it('maps duplicate email application errors to the existing bad request response', async () => {
    createUserUseCase.execute.mockRejectedValue(new EmailAlreadyRegisteredError());

    await expect(
      controller.register({
        email: 'user@example.com',
        password: 'secure-password',
      }),
    ).rejects.toMatchObject({
      response: {
        error: 'Bad Request',
        message: 'El correo electrónico ya está registrado.',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('maps invalid credentials application errors to the existing unauthorized response', async () => {
    loginUseCase.execute.mockRejectedValue(new InvalidCredentialsError());

    await expect(
      controller.login({
        email: 'user@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toMatchObject({
      response: {
        error: 'Unauthorized',
        message: 'Invalid Credentials.',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      status: HttpStatus.UNAUTHORIZED,
    });
  });

  it('keeps successful registration responses delegated to the use case', async () => {
    const createdUser = {
      id: 1,
      email: 'user@example.com',
      role: UserRole.USER,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: null,
    };
    createUserUseCase.execute.mockResolvedValue(createdUser);

    await expect(
      controller.register({
        email: 'user@example.com',
        password: 'secure-password',
      }),
    ).resolves.toBe(createdUser);
  });

  it('rethrows unknown registration errors unchanged', async () => {
    const unknownError = new Error('database unavailable');
    createUserUseCase.execute.mockRejectedValue(unknownError);

    await expect(
      controller.register({
        email: 'user@example.com',
        password: 'secure-password',
      }),
    ).rejects.toBe(unknownError);
  });

  it('uses Nest HTTP exception types for translated application errors', async () => {
    createUserUseCase.execute.mockRejectedValue(new EmailAlreadyRegisteredError());
    loginUseCase.execute.mockRejectedValue(new InvalidCredentialsError());

    await expect(
      controller.register({
        email: 'user@example.com',
        password: 'secure-password',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      controller.login({
        email: 'user@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
