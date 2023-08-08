import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
          ttl: parseInt(process.env.REDIS_TTL),
          isGlobal: true,
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
