import {IsString,IsOptional} from "class-validator"
export class CreateSupplierDto {
    @IsOptional()
    @IsString()
    readonly raisonSocial : string
}