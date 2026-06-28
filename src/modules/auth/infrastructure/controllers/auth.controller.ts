import { InvalidCredentialsError } from '@modules/auth/application/errors';
import { LoginUseCase } from '@modules/auth/application/use-cases/login';
import { EmailAlreadyRegisteredError } from '@modules/users/application/errors';
import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user';
import { CreateUserDto } from '@modules/users/infrastructure/dto';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.createUserUseCase.execute(createUserDto);
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.loginUseCase.execute(loginDto);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }

      throw error;
    }
  }
}
