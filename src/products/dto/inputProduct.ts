import {IsNotEmpty,IsString,IsOptional} from "class-validator"
export class InputProduct {
    @IsString()
    @IsNotEmpty()
    readonly name : string
    @IsString()
    @IsOptional()
    readonly comment : string
}