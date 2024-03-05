import { CoordonneesType } from '@/utils/types/coordonnees.type';
import { InformationsType } from '@/utils/types/informations.type';
import { LegalType } from '@/utils/types/legal.type';
import { Supplier_contactType } from '@/utils/types/supplier_contact.type';
import {
  Coordonnees,
  Informations,
  Legal,
  Supplier_contact,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateSupplierDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly raisonSocial: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly note: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => InformationsType)
  @IsOptional()
  readonly informations: Informations;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CoordonneesType)
  @IsOptional()
  readonly coordonnees: Coordonnees;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => Supplier_contactType)
  @IsOptional()
  readonly supplier_contact: Supplier_contact[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => LegalType)
  @IsOptional()
  readonly legal: Legal;
}
