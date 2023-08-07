import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from 'src/models/file.model';
import { GetPublicUrlResponse } from 'src/models/dto/response/get-public-url.result';

@Injectable()
export class MinioClientService {
  constructor(
    private readonly minio: MinioService,
    private readonly config: ConfigService,
  ) {
    this.logger = new Logger('MinioService');

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:ListBucketMultipartUploads',
            's3:GetBucketLocation',
            's3:ListBucket',
          ],
          Resource: [`arn:aws:s3:::${this.bucketName}`],
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:PutObject',
            's3:AbortMultipartUpload',
            's3:DeleteObject',
            's3:GetObject',
            's3:ListMultipartUploadParts',
          ],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };

    try {
      this.client.bucketExists(this.bucketName).then((value) => {
        if (value) {
          this.client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
        } else {
          this.client.makeBucket(this.bucketName).then(() => {
            this.client.setBucketPolicy(
              this.bucketName,
              JSON.stringify(policy),
            );
          });
        }
      });
    } catch (error) {
      this.logger.error(error, 'create:bucket');
    }
  }

  private readonly logger: Logger;
  private readonly bucketName = this.config.get('MINIO_BUCKET_NAME');

  public get client() {
    return this.minio.client;
  }

  public async upload(
    file: BufferedFile,
    bucketName: string = this.bucketName,
  ) {
    if (
      !(
        file?.mimetype.includes('jpeg') ||
        file?.mimetype.includes('png') ||
        file?.mimetype.includes('pdf')
      )
    ) {
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );

    const fileName = hashedFileName + extension;

    this.client.putObject(
      bucketName,
      fileName,
      file.buffer,
      function (err, res) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );

    return {
      url: `${this.config.get('MINIO_ENDPOINT')}:${this.config.get(
        'MINIO_PORT',
      )}/${this.config.get('MINIO_BUCKET_NAME')}/${fileName}`,
    };
  }

  async delete(objetName: string, bucketName: string = this.bucketName) {
    this.client.removeObject(bucketName, objetName, (err: any) => {
      if (err)
        throw new HttpException(
          'An error occured when deleting!',
          HttpStatus.BAD_REQUEST,
        );
    });
  }

  async getFile(bucketName: string, fileName: string) {
    return await this.client.getObject(bucketName, fileName);
  }

  async getPublicUrl(fileName: string, download: boolean) {
    const respHeaders = {
      'response-content-disposition': 'inline',
    };
    if (download) {
      respHeaders['response-content-disposition'] = `attachment`;
    }

    const publicUrlStr = await this.client.presignedGetObject(
      this.bucketName,
      fileName,
      parseInt(this.config.get('MINIO_EXPIRED_TIME')),
      respHeaders,
    );

    const publicUrl = new URL(publicUrlStr);

    publicUrl.host = this.config.get('MINIO_PUBLIC_HOST');
    publicUrl.protocol = 'http:';
    // if (this.config.get('MINIO_SSL')) {
    //   publicUrl.protocol = 'https:';
    // }

    return new GetPublicUrlResponse({
      fileName: fileName,
      publicUrl: publicUrl.toString(),
    });
  }
}
