import { Transform, plainToInstance } from 'class-transformer';
import { OutputUserDto } from './output-user.dto';
export class OutputSigninDto {
  readonly access_token: string;
  @Transform(({ value }) => plainToInstance(OutputUserDto, value))
  readonly user: OutputUserDto;
}
