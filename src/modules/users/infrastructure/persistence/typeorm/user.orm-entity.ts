import { CustomBaseEntity } from '@database/orm/entities';
import { USER_ROLES, type UserRoleValue } from '@modules/users/domain/models';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserOrmEntity extends CustomBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: USER_ROLES,
    default: USER_ROLES.USER,
  })
  role: UserRoleValue;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;
}
