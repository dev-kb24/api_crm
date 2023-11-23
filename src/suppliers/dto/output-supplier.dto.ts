export class OutputSupplierDto {
  suppliersId: string;
  raisonSocial: string;

  constructor(partial: Partial<OutputSupplierDto>) {
    Object.assign(this, partial);
  }
}
