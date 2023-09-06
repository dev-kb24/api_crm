import {IsNotEmpty,IsString} from "class-validator"
export class InputSuppliersId {
    @IsString()
    @IsNotEmpty()
    readonly suppliersId : string
}