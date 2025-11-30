import { CustomBaseEntity } from '@database/orm/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'specialties' })
export class SpecialtyEntity extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  constructor(data: Partial<SpecialtyEntity>) {
    super();
    Object.assign(this, data);
  }
}
