import { UserRole } from '@modules/users/domain/entities';
import { USER_REPOSITORY, UserRepositoryInterface } from '@modules/users/domain/repositories';
import { UserMapper } from '@modules/users/infrastructure/mappers';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) { }

  async execute(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }

    const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: encryptedPassword,
    });

    return UserMapper.toDto(newUser);
  }
}

