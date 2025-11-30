import { CustomBaseEntity } from '@database/orm/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { MedicalCenterEntity } from './medical-center.entity';
import { SpecialtyEntity } from './specialty.entity';
import { DoctorEntity } from './doctor.entity';
import { AppointmentEntity } from './appointment.entity';

@Entity({ name: 'schedules' })
export class ScheduleEntity extends CustomBaseEntity {

  @OneToOne(() => MedicalCenterEntity)
  @JoinColumn()
  medicalCenter: MedicalCenterEntity;

  @OneToOne(() => SpecialtyEntity)
  @JoinColumn()
  specialty: SpecialtyEntity;

  @ManyToOne(() => DoctorEntity)
  doctor: DoctorEntity;

  @OneToOne(() => AppointmentEntity, (appointment) => appointment.schedule)
  appointment: AppointmentEntity;

  constructor(data: Partial<ScheduleEntity>) {
    super();
    Object.assign(this, data);
  }
}
