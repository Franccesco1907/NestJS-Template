import { EnvironmentService } from '@config/environment/services';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { Module } from '@nestjs/common';

export const CACHE_INSTANCE = 'CACHE_INSTANCE';

@Module({
  providers: [
    {
      provide: CACHE_INSTANCE,
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => {
        const { host, port, password } = environmentService.cache;
        const redisUrl = `redis://default:${password}@${host}:${port}`;
        const keyv = new Keyv(new KeyvRedis(redisUrl), { namespace: 'cache' });
        return keyv;
      },
    },
  ],
  exports: [CACHE_INSTANCE],
})
export class CustomCacheModule { }
