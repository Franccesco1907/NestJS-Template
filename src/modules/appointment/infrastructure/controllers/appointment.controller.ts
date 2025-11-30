import { ScheduleUseCase } from "@modules/appointment/application/use-cases/schedule/schedule.use-case";
import { Controller, Get } from "@nestjs/common";

@Controller("appointment")
export class AppointmentController {
  constructor(
    private readonly scheduleUseCase: ScheduleUseCase,
  ) { }

  @Get()
  find() {
    return this.scheduleUseCase.execute();
  }
}