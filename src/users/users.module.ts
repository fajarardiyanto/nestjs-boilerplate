import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisModule } from 'src/config/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), RedisModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
