import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class InformationsType {
  @ApiProperty()
  @IsBoolean()
  readonly type_supplier: boolean;

  @ApiProperty()
  @IsString()
  readonly society_name: string;

  @ApiProperty()
  @IsString()
  readonly site_web: string;
}
