import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/config/minio-client/minio-client.service';
import { BufferedFile } from 'src/models/file.model';

@Injectable()
export class AssetsService {
  constructor(private minio: MinioClientService) {}

  async uploadFile(file: BufferedFile) {
    return await this.minio.upload(file);
  }

  async getFile(fileName: string) {
    const bucketName = process.env.MINIO_BUCKET_NAME;
    return await this.minio.getFile(bucketName, fileName);
  }

  async getPublicUrl(fileName: string, download: boolean) {
    return await this.minio.getPublicUrl(fileName, download);
  }
}
