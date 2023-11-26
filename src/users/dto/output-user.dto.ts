import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class OutputUserDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @Exclude()
  password: string;

  constructor(partial: Partial<OutputUserDto>) {
    Object.assign(this, partial);
  }
}
