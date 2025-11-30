import { Global, Module } from '@nestjs/common';
import { EnvironmentModule } from './environment/modules/environment.module';

@Global()
@Module({
  imports: [EnvironmentModule],
  exports: [EnvironmentModule],
})
export class CustomConfigModule { }
