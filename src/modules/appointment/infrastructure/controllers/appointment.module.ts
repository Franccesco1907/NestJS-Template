import { AppointmentEntity, DoctorEntity, MedicalCenterEntity, ScheduleEntity, SpecialtyEntity } from "@modules/appointment/domain/entities";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentController } from "./appointment.controller";
import { ScheduleUseCase } from "@modules/appointment/application/use-cases/schedule/schedule.use-case";
import { AppointmentRepository } from "../repositories";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppointmentEntity,
      DoctorEntity,
      MedicalCenterEntity,
      ScheduleEntity,
      SpecialtyEntity,
    ])
  ],
  controllers: [AppointmentController],
  providers: [AppointmentRepository, ScheduleUseCase],
  exports: [TypeOrmModule],
})
export class AppointmentModule { }