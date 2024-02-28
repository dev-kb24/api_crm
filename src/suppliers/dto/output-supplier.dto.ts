import {
  Coordonnees,
  Informations,
  Legal,
  Supplier_contact,
} from '@prisma/client';

export class OutputSupplierDto {
  readonly suppliersId: string;
  readonly raisonSocial: string;
  readonly note: string;
  readonly informations: Informations;
  readonly coordonnees: Coordonnees;
  readonly supplier_contact: Supplier_contact[];
  readonly legal: Legal;

  constructor(partial: Partial<OutputSupplierDto>) {
    Object.assign(this, partial);
  }
}
