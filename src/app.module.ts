import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { MinioClientModule } from './config/minio-client/minio-client.module';
import { AssetsModule } from './assets/assets.module';
import { RedisModule } from './config/redis/redis.module';
import { KafkaModule } from './config/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    MinioClientModule,
    AssetsModule,
    RedisModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
