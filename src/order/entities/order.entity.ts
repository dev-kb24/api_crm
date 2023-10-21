import { ProductEntity } from "src/products/entities/productEntity"
import { AddressEntity } from "./address.entity"
import { PicturesEntity } from "./pictures.entity"
export class OrderEntity {
    readonly orderId : string
    readonly name: string
    readonly comment: string
    readonly created_at: Date
    readonly updated_at: Date
    readonly started_at: Date
    readonly finished_at: Date
    readonly authorId: string
    readonly usersId: Array<String>
    readonly productsId: Array<String>
    readonly users: Array<Object>
    readonly products: Array<ProductEntity>
    readonly address: AddressEntity
    readonly picture_before: PicturesEntity|Object
    readonly picture_after: PicturesEntity|Object
}