import { CustomBaseEntity } from '@database/orm/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

export enum CountryISO {
  PE = 'PE',
  CL = 'CL',
}

@Entity({ name: 'appointments' })
export class AppointmentEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 5 })
  insuredId: string;

  @Column({ type: 'number' })
  scheduleId: number;

  @Column({
    type: 'enum',
    enum: CountryISO,
    default: CountryISO.PE,
  })
  countryISO: CountryISO;

  @OneToOne(() => ScheduleEntity)
  @JoinColumn()
  schedule: ScheduleEntity;

  constructor(data: Partial<AppointmentEntity>) {
    super();
    Object.assign(this, data);
  }
}
