import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCache(key: string, value: any): Promise<void> {
    await this.cacheManager.set(key, value, 300);
  }

  async getCache(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }
}
