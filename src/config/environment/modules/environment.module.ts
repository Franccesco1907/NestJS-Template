import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentService } from '../services/environment.service';
import { EnvironmentVariables } from '../validations/environment.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, unknown>) => {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, {
          enableImplicitConversion: true,
        });

        const errors = validateSync(validatedConfig, {
          skipMissingProperties: false,
        });

        if (errors.length > 0) {
          const errorMessages = errors
            .map((error) => Object.values(error.constraints ?? {}))
            .flat()
            .join(', ');
          throw new Error(`Configuration validation error: ${errorMessages}`);
        }

        return validatedConfig;
      },
      envFilePath: '.env',
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule { }
