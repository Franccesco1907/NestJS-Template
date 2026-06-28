import { UserEntity, UserRole } from '@modules/users/domain/entities';
import { UserMapper } from './user.mapper';

describe('UserMapper', () => {
  it('maps users to DTOs without exposing password', () => {
    const user = new UserEntity();
    user.id = 1;
    user.email = 'user@example.com';
    user.password = 'hashed-secret';
    user.role = UserRole.USER;
    user.firstName = 'Template';
    user.lastName = 'User';
    user.createdAt = new Date('2026-01-01T00:00:00.000Z');
    user.updatedAt = null;
    user.deletedAt = null;

    const dto = UserMapper.toDto(user);

    expect(dto).toEqual({
      id: 1,
      email: 'user@example.com',
      role: UserRole.USER,
      firstName: 'Template',
      lastName: 'User',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: null,
    });
    expect(dto).not.toHaveProperty('password');
  });
});
