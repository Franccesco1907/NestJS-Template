
import { AppointmentEntity } from "@modules/appointment/domain/entities";
import { AppointmentRepository } from "@modules/appointment/infrastructure/repositories";
import { Inject } from "@nestjs/common";

export class ScheduleUseCase {
  constructor(
    @Inject(AppointmentRepository) private readonly appointmentRepository: AppointmentRepository,
  ) { }

  async execute(): Promise<AppointmentEntity[] | null> {
    return await this.appointmentRepository.findByIp('a')
  }
}