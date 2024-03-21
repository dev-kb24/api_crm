import { Expose, Transform, plainToInstance } from 'class-transformer';
import { OutputUserDto } from './output-user.dto';
export class OutputSigninDto {
  @Expose()
  readonly access_token: string;
  @Expose()
  @Transform(({ value }) => plainToInstance(OutputUserDto, value))
  readonly user: OutputUserDto;
}
