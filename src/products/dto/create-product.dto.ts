import {IsNotEmpty,IsString,IsOptional, IsInt} from "class-validator"
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name : string
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly comment : string
    @ApiProperty()
    @IsInt()
    @IsOptional()
    readonly stock : number
}