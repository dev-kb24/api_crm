import { Exclude } from "class-transformer"
import { OrderEntity } from "src/order/entities/order.entity"
export class OutputProduct {
     productId : String
     name: String
     comment : String
     stock : number
     created_at : Date
     updated_at : Date
     @Exclude()
     ordersId : Array<string>
     order : Array<OrderEntity>

     constructor(partial: Partial<OutputProduct>) {
        Object.assign(this, partial);
    }
}