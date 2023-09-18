export class OutputSupplier {
     suppliersId: string
     raisonSocial: string

     constructor(partial: Partial<OutputSupplier>) {
        Object.assign(this, partial);
    }

}