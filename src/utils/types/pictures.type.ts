import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PicturesType {
  @ApiProperty()
  @IsString()
  readonly path: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly format: string;
}
