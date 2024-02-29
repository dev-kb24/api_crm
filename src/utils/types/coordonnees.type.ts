import { Type } from 'class-transformer';
import { IsEmail, IsString, Length, ValidateNested } from 'class-validator';
import { AddressType } from './address.type';
import { Address } from '@prisma/client';

export class CoordonneesType {
  @IsString()
  @Length(10)
  readonly phone: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(10)
  readonly mobile: string;

  @ValidateNested({ each: true })
  @Type(() => AddressType)
  readonly address: Address;
}
