import { Exclude } from 'class-transformer';
export class OutputUser {
     userId : String
     email : String
     firstname : String
     lastname : String
     @Exclude()
     password: String

     constructor(partial: Partial<OutputUser>) {
        Object.assign(this, partial);
    }

}