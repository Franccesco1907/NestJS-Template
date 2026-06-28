import type { CreateUserCommand, UserOutput } from '@modules/users/application/dto';
import { UserOutputMapper } from '@modules/users/application/mappers';
import { USER_ROLES } from '@modules/users/domain/models';
import { USER_REPOSITORY, UserRepositoryInterface } from '@modules/users/domain/repositories';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) { }

  async execute(createUserDto: CreateUserCommand): Promise<UserOutput> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }

    const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userRepository.create({
      email: createUserDto.email,
      password: encryptedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: USER_ROLES.USER,
    });

    return UserOutputMapper.toOutput(newUser);
  }
}
