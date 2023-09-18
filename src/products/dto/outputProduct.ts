export class OutputProduct {
     productId : String
     name: String
     comment : String
     stock : number
     created_at : Date
     updated_at : Date
     
     constructor(partial: Partial<OutputProduct>) {
        Object.assign(this, partial);
    }
}