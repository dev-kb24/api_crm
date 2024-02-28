import { IsArray, IsString } from 'class-validator';

export class CategoriesType {
  @IsString()
  readonly name: string;

  @IsString()
  readonly comment: string;

  @IsArray()
  @IsString({ each: true })
  readonly productsId: string[];
}
