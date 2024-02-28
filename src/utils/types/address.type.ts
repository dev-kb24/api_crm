import { IsString } from 'class-validator';

export class AddressType {
  @IsString()
  readonly name_address: string;

  @IsString()
  readonly street: string;

  @IsString()
  readonly city: string;

  @IsString()
  readonly zip: string;
}
