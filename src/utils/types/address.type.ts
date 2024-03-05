import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressType {
  @ApiProperty()
  @IsString()
  readonly name_address: string;

  @ApiProperty()
  @IsString()
  readonly street: string;

  @ApiProperty()
  @IsString()
  readonly city: string;

  @ApiProperty()
  @IsString()
  readonly zip: string;
}
