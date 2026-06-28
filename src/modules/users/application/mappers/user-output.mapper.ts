import type { User } from '@modules/users/domain/models';
import type { UserOutput } from '../dto';

export class UserOutputMapper {
  static toOutput(user: User): UserOutput {
    const { id, email, firstName, lastName, role, createdAt, updatedAt } = user;
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
