import { UserEntity } from '@modules/users/domain/entities';
import type { User } from '@modules/users/domain/models';
import type { CreateUserInput } from '@modules/users/domain/repositories';
import { UserOrmEntity } from './user.orm-entity';

export class UserPersistenceMapper {
  static toDomain(entity: UserOrmEntity): User {
    const user = new UserEntity();
    user.id = entity.id;
    user.email = entity.email;
    user.password = entity.password;
    user.role = entity.role;
    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;
    user.deletedAt = entity.deletedAt;
    return user;
  }

  static toOrm(input: CreateUserInput): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.email = input.email;
    entity.password = input.password;
    entity.role = input.role;
    entity.firstName = input.firstName;
    entity.lastName = input.lastName;
    return entity;
  }
}
