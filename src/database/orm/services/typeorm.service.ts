import { EnvironmentService } from '@config/environment';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly environmentService: EnvironmentService) { }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const { host, name, password, port, username } = this.environmentService.database;

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database: name,
      autoLoadEntities: true,
      entities: [],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: true,
      synchronize: this.environmentService.environment !== 'production',
    };
  }
}
