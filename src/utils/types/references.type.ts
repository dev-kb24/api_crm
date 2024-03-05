import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReferencesType {
  @ApiProperty()
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsString()
  readonly model: string;

  @ApiProperty()
  @IsString()
  readonly mark: string;
}
