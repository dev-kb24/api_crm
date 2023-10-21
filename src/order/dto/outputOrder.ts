import { ProductEntity } from "src/products/entities/productEntity"
import { AddressEntity } from "../entities/address.entity"
import { PicturesEntity } from "../entities/pictures.entity"
import { Exclude } from "class-transformer"

export class OutputOrder {
    readonly name: string
    readonly comment: string
    readonly created_at: Date
    readonly updated_at: Date
    readonly started_at: Date
    readonly finished_at: Date
    readonly authorId: string
    @Exclude()
    readonly usersId: Array<String>
    @Exclude()
    readonly productsId: Array<String>
    readonly users: Array<Object>
    readonly products: Array<ProductEntity>
    readonly address: AddressEntity
    readonly picture_before: PicturesEntity|Object
    readonly picture_after: PicturesEntity|Object
    
    constructor(partial: Partial<OutputOrder>) {
       Object.assign(this, partial);
   }
}