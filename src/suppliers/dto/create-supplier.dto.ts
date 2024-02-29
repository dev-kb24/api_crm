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
export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  readonly raisonSocial: string;

  @IsOptional()
  @IsString()
  readonly note: string;

  @ValidateNested()
  @Type(() => InformationsType)
  readonly informations: Informations;

  @ValidateNested()
  @Type(() => CoordonneesType)
  readonly coordonnees: Coordonnees;

  @ValidateNested({ each: true })
  @Type(() => Supplier_contactType)
  readonly supplier_contact: Supplier_contact[];

  @ValidateNested()
  @Type(() => LegalType)
  readonly legal: Legal;
}
