import { Column, Entity, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '@database/orm/entities/base.entity';
import { DoctorEntity } from './doctor.entity';

@Entity({ name: 'medical_centers' })
export class MedicalCenterEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  openingHours: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => DoctorEntity, doctor => doctor.medicalCenter)
  doctors: DoctorEntity[];
}
