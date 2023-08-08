import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisModule } from 'src/config/redis/redis.module';
import { KafkaModule } from 'src/config/kafka/kafka.module';
import { UserConsumer } from './users.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), RedisModule, KafkaModule],
  providers: [UsersService, UserConsumer],
  controllers: [UsersController],
})
export class UsersModule {}
