import {IsNotEmpty,IsString,IsOptional, IsInt} from "class-validator"
export class InputProduct {
    @IsString()
    @IsNotEmpty()
    readonly name : string
    @IsString()
    @IsOptional()
    readonly comment : string
    @IsInt()
    @IsOptional()
    readonly stock : number
}