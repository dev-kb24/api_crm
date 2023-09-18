import {IsString,IsOptional} from "class-validator"
export class InputSupplier {
    @IsOptional()
    @IsString()
    readonly raisonSocial : string
}