import { ApiProperty } from '@nestjs/swagger';
export class OutputSupplierDto {
  @ApiProperty()
  suppliersId: string;
  @ApiProperty()
  raisonSocial: string;

  constructor(partial: Partial<OutputSupplierDto>) {
    Object.assign(this, partial);
  }
}
