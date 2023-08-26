import {IsNotEmpty,IsString} from "class-validator"
export class InputUserPassword {
    @IsString()
    @IsNotEmpty()
    readonly newPassword : string
    @IsString()
    @IsNotEmpty()
    readonly oldPassword : string
}