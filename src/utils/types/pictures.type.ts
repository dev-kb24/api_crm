import { IsString } from 'class-validator';

export class PicturesType {
  @IsString()
  readonly path: string;
  @IsString()
  readonly name: string;
  @IsString()
  readonly format: string;
}
