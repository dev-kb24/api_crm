import {IsNotEmpty,IsString} from "class-validator"
export class InputProductId {
    @IsString()
    @IsNotEmpty()
    readonly productId : string
}