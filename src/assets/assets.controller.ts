import {
  Controller,
  Param,
  Post,
  Get,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/models/file.model';
import { GetPublicUrlResponse } from 'src/models/dto/response/get-public-url.result';

@Controller('assets')
export class AssetsController {
  constructor(private service: AssetsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: BufferedFile) {
    const res = await this.service.uploadFile(file);
    return {
      file_url: res.url,
      message: 'successfully upload file',
    };
  }

  @Get(':fileName')
  async getFile(@Param('fileName') filename: string, @Res() res) {
    const file = await this.service.getFile(filename);
    file.pipe(res);
  }

  @Get('public/:download/:fileName')
  async getPublicUrl(
    @Param('download') download: boolean,
    @Param('fileName') filename: string,
  ) {
    const file = await this.service.getPublicUrl(filename, download);

    return new GetPublicUrlResponse({
      fileName: file.fileName,
      publicUrl: file.publicUrl,
    });
  }
}
