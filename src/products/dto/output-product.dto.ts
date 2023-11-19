import { Exclude } from "class-transformer"
import { OrderEntity } from "@/order/entities/order.entity"
import {ApiProperty} from "@nestjs/swagger"
export class OutputProductDto {
    @ApiProperty()
     productId : String
     @ApiProperty()
     name: String
     @ApiProperty()
     comment : String
     @ApiProperty()
     stock : number
     @ApiProperty()
     created_at : Date
     @ApiProperty()
     updated_at : Date
     @Exclude()
     ordersId : Array<string>
     @ApiProperty()
     order : Array<OrderEntity>

     constructor(partial: Partial<OutputProductDto>) {
        Object.assign(this, partial);
    }
}