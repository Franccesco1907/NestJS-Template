import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user';
import { FindUserByEmailUseCase } from '@modules/users/application/use-cases/find-user-by-email';
import { UserEntity } from '@modules/users/domain/entities';
import { USER_REPOSITORY } from '@modules/users/domain/repositories';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../repositories';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    CreateUserUseCase,
    FindUserByEmailUseCase,
  ],
  exports: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    CreateUserUseCase,
    FindUserByEmailUseCase,
  ],
})
export class UsersModule { }

