import { IsBoolean, IsString } from 'class-validator';

export class InformationsType {
  @IsBoolean()
  readonly type_supplier: boolean;

  @IsString()
  readonly society_name: string;

  @IsString()
  readonly site_web: string;
}
