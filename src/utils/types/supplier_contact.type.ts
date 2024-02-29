import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';

export class Supplier_contactType {
  @IsBoolean()
  readonly principal_contact: boolean;

  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(10)
  readonly phone: string;

  @IsString()
  @Length(10)
  readonly mobile: string;

  @IsString()
  readonly fonction: string;
}
