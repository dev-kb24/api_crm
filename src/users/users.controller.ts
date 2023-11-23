import {
  Body,
  Controller,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { OutputUserDto } from './dto/output-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersGuard } from './users.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<OutputUserDto> {
    return new OutputUserDto(await this.userService.signup(createUserDto));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signin')
  async signin(@Body() createUserDto: CreateUserDto): Promise<OutputUserDto> {
    return new OutputUserDto(await this.userService.signin(createUserDto));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Put('password/:id')
  async updatePassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Param('id') userId: string,
  ): Promise<string> {
    await this.userService.updatePassword(updateUserPasswordDto, userId);
    return 'Le mot de passe a été modifié';
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Get('getProfil/:id')
  async getProfil(@Param('id') userId: string): Promise<OutputUserDto> {
    return new OutputUserDto(await this.userService.getProfil(userId));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Put(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') userId: string,
  ): Promise<OutputUserDto> {
    return new OutputUserDto(
      await this.userService.update(updateUserDto, userId),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Delete(':id')
  async delete(@Param('id') userId: string): Promise<string> {
    await this.userService.delete(userId);
    return "L'utilisateur a été supprimé";
  }

  @UseGuards(UsersGuard)
  @Get('access')
  access(): string {
    return 'Vous etes Autorisé !';
  }
}
