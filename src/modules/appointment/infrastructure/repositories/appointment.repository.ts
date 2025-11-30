import { OrmBaseRepository } from "@database/orm/repositories";
import { AppointmentEntity } from "@modules/appointment/domain/entities";
import { AppointmentRepositoryInterface } from "@modules/appointment/domain/repositories";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";


@Injectable()
export class AppointmentRepository extends OrmBaseRepository<AppointmentEntity> implements AppointmentRepositoryInterface {
  constructor(
    @InjectRepository(AppointmentEntity) private readonly appointmentRepository: Repository<AppointmentEntity>,
    private dataSource: DataSource,
  ) {
    super(appointmentRepository.target, dataSource);
  }

  async findByIp(ip: string): Promise<AppointmentEntity[] | null> {
    console.log("Finding appointments by IP:", ip);
    return await this.appointmentRepository.find();
  }
}
