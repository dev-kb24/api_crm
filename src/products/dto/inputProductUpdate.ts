import {IsString,IsOptional, IsInt} from "class-validator"
export class InputProductUpdate {
    @IsString()
    @IsOptional()
    readonly name : string
    @IsString()
    @IsOptional()
    readonly comment : string
    @IsInt()
    @IsOptional()
    readonly stock : number
}