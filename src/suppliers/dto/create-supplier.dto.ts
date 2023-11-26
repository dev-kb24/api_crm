import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateSupplierDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly raisonSocial: string;
}
