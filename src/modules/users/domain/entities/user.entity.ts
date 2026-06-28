import { CustomBaseEntity } from '@database/orm/entities';
import { Column, Entity } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  DOCTOR = 'doctor',
}

@Entity('users')
// Transitional TypeORM entity kept in domain during PR1 to avoid wiring churn.
// PR2 should move persistence decorators to an infrastructure ORM entity.
export class UserEntity extends CustomBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;
}
