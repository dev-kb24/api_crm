export class OutputProduct {
     productId : String
     name: String
     comment : String
     stock : number
     created_at : string
     updated_at : string
     
     constructor(partial: Partial<OutputProduct>) {
        Object.assign(this, partial);
    }
}