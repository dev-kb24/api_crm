import { Exclude } from 'class-transformer';
export class OutputUserDto {
     userId : String
     email : String
     firstname : String
     lastname : String
     @Exclude()
     password: String

     constructor(partial: Partial<OutputUserDto>) {
        Object.assign(this, partial);
    }

}