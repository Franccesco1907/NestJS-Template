import { UserEntity } from '../../domain/entities/user.entity';
import { UserDto } from '../dto/user.dto';

export class UserMapper {
  static toDto(entity: UserEntity): UserDto {
    const { id, email, firstName, lastName, role, createdAt, updatedAt } = entity;
    return {
      id,
      email,
      firstName,
      lastName,
      role,
      createdAt,
      updatedAt,
    };
  }

}
