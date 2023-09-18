export class OutputProduct {
     productId : String
     name: String
     comment : String
     
     constructor(partial: Partial<OutputProduct>) {
        Object.assign(this, partial);
    }
}