import {IsNotEmpty,IsString,IsOptional,IsEmail} from "class-validator"
export class InputUserUpdate {
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    readonly email : string
    @IsString()
    @IsOptional()
    readonly firstname : string
    @IsString()
    @IsOptional()
    readonly lastname : string
}