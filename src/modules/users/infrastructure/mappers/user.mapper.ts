import { UserEntity } from '../../domain/entities/user.entity';
import { UserDto } from '../dto/user.dto';

export class UserMapper {
  static toDto(entity: UserEntity): UserDto {
    const { id, email, password, firstName, lastName, role, createdAt, updatedAt } = entity;
    return {
      id,
      email,
      password,
      firstName,
      lastName,
      role,
      createdAt,
      updatedAt,
    };
  }

  static toEntity(dto: UserDto): UserEntity {
    const entity = new UserEntity();
    entity.id = dto.id;
    entity.email = dto.email;
    entity.password = dto.password;
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.role = dto.role;
    entity.createdAt = dto.createdAt;
    entity.updatedAt = dto.updatedAt;

    return entity;
  }
}

