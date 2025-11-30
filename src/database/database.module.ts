import { Global, Module } from '@nestjs/common';
import { OrmDatabaseModule } from './orm';
import { CustomCacheModule } from './cache/cache.module';

@Global()
@Module({
  imports: [
    OrmDatabaseModule,
    CustomCacheModule,
  ],
  exports: [
    OrmDatabaseModule,
    CustomCacheModule,
  ],
})
export class DatabaseModule { }
