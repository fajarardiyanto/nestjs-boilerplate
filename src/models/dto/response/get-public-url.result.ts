import { IQueryResult } from '@nestjs/cqrs';
import { Expose } from 'class-transformer';
import { NonFunctionProperties } from 'src/shared/interfaces/helper.interfaces';

export class GetPublicUrlResponse implements IQueryResult {
  @Expose({ name: 'file_name' })
  readonly fileName: string;

  @Expose({ name: 'public_url' })
  readonly publicUrl: string;

  constructor(props: NonFunctionProperties<GetPublicUrlResponse>) {
    Object.assign(this, props);
  }
}
