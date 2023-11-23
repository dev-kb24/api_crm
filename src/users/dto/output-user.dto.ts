import { Exclude } from 'class-transformer';
export class OutputUserDto {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  @Exclude()
  password: string;

  constructor(partial: Partial<OutputUserDto>) {
    Object.assign(this, partial);
  }
}
