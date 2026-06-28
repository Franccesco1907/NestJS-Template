import { PASSWORD_HASHER, type PasswordHasherPort } from '@modules/users/application/ports';
import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user';
import { FindUserByEmailUseCase } from '@modules/users/application/use-cases/find-user-by-email';
import { USER_REPOSITORY, type UserRepositoryInterface } from '@modules/users/domain/repositories';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../persistence/typeorm';
import { UserRepository } from '../repositories';
import { BcryptPasswordHasherService } from '../services';
import { UserController } from './user.controller';

const userRepositoryProvider = {
  provide: USER_REPOSITORY,
  useClass: UserRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    userRepositoryProvider,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasherService,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepositoryInterface, passwordHasher: PasswordHasherPort) =>
        new CreateUserUseCase(userRepository, passwordHasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: FindUserByEmailUseCase,
      useFactory: (userRepository: UserRepositoryInterface) =>
        new FindUserByEmailUseCase(userRepository),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [USER_REPOSITORY, PASSWORD_HASHER, CreateUserUseCase, FindUserByEmailUseCase],
})
export class UsersModule {}
