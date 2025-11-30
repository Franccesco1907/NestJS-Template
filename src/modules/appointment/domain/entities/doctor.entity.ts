import { CustomBaseEntity } from '@database/orm/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MedicalCenterEntity } from './medical-center.entity';
import { SpecialtyEntity } from './specialty.entity';

@Entity({ name: 'doctors' })
export class DoctorEntity extends CustomBaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true, length: 20 })
  phone?: string;

  @ManyToOne(() => SpecialtyEntity)
  specialty?: SpecialtyEntity;

  @Column({ unique: true, nullable: true, length: 50 })
  licenseNumber?: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => MedicalCenterEntity, medicalCenter => medicalCenter.doctors)
  medicalCenter: MedicalCenterEntity;

  constructor(data: Partial<DoctorEntity>) {
    super();
    Object.assign(this, data);
  }
}
