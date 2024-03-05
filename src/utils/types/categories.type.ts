import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CategoriesType {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly comment: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly productsId: string[];
}
