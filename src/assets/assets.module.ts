import { Module } from '@nestjs/common';
import { MinioClientModule } from 'src/config/minio-client/minio-client.module';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  imports: [MinioClientModule],
  providers: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}
