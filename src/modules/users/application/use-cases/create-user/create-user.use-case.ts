import type { CreateUserCommand, UserOutput } from '@modules/users/application/dto';
import { EmailAlreadyRegisteredError } from '@modules/users/application/errors';
import { UserOutputMapper } from '@modules/users/application/mappers';
import type { PasswordHasherPort } from '@modules/users/application/ports';
import { USER_ROLES } from '@modules/users/domain/models';
import type { UserRepositoryInterface } from '@modules/users/domain/repositories';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(createUserDto: CreateUserCommand): Promise<UserOutput> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new EmailAlreadyRegisteredError();
    }

    const encryptedPassword = await this.passwordHasher.hash(createUserDto.password);

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
