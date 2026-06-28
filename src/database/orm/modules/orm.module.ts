import { EnvironmentModule } from '@config/environment/modules';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../services/typeorm.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class OrmDatabaseModule { }
