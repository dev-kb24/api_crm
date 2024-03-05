import { Type } from 'class-transformer';
import { IsEmail, IsString, Length, ValidateNested } from 'class-validator';
import { AddressType } from './address.type';
import { Address } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CoordonneesType {
  @ApiProperty()
  @IsString()
  @Length(10)
  readonly phone: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Length(10)
  readonly mobile: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => AddressType)
  readonly address: Address;
}
