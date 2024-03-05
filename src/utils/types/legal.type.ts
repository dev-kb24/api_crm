import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LegalType {
  @ApiProperty()
  @IsString()
  readonly status: string;

  @ApiProperty()
  @IsString()
  @Length(14)
  readonly siret: string;

  @ApiProperty()
  @IsString()
  @Length(9)
  readonly siren: string;

  @ApiProperty()
  @IsString()
  @Length(5)
  readonly naf: string;

  @ApiProperty()
  @IsString()
  readonly capital: string;

  @ApiProperty()
  @IsString()
  readonly rcs: string;

  @ApiProperty()
  @IsString()
  readonly tva: string;
}
