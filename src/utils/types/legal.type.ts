import { IsString, Length } from 'class-validator';

export class LegalType {
  @IsString()
  readonly status: string;

  @IsString()
  @Length(14)
  readonly siret: string;

  @IsString()
  @Length(9)
  readonly siren: string;

  @IsString()
  @Length(5)
  readonly naf: string;

  @IsString()
  readonly capital: string;

  @IsString()
  readonly rcs: string;

  @IsString()
  readonly tva: string;
}
