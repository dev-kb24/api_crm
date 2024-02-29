import { IsString } from 'class-validator';

export class ReferencesType {
  @IsString()
  readonly id: string;

  @IsString()
  readonly model: string;

  @IsString()
  readonly mark: string;
}
