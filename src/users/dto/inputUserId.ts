import {IsNotEmpty,IsString} from "class-validator"
export class InputUserId {
    @IsString()
    @IsNotEmpty()
    readonly userId : string
}