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
  HttpCode,
} from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { UsersService } from './users.service';
import { OutputUserDto } from './dto/output-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersGuard } from './users.guard';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { SigninUserDto } from './dto/signin-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  @ApiOkResponse({ description: 'Opération réussie', type: OutputUserDto })
  @ApiBody({ type: SignupUserDto })
  async signup(@Body() signupUserDto: SignupUserDto): Promise<OutputUserDto> {
    return new OutputUserDto(await this.userService.signup(signupUserDto));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signin')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Opération réussie', type: OutputUserDto })
  @ApiBody({ type: SigninUserDto })
  async signin(@Body() signinUserDto: SigninUserDto): Promise<OutputUserDto> {
    return new OutputUserDto(await this.userService.signin(signinUserDto));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Put('password/:id')
  @ApiOkResponse({ description: 'Opération réussie', type: OutputUserDto })
  @ApiBody({ type: UpdateUserPasswordDto })
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
  @ApiOkResponse({ description: 'Opération réussie', type: OutputUserDto })
  async getProfil(@Param('id') userId: string): Promise<OutputUserDto> {
    return new OutputUserDto(await this.userService.getProfil(userId));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Put(':id')
  @ApiOkResponse({ description: 'Opération réussie', type: OutputUserDto })
  @ApiBody({ type: UpdateUserDto })
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
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Delete(':id')
  @ApiNoContentResponse({ description: 'Le produit à été supprimé' })
  async delete(@Param('id') userId: string): Promise<string> {
    await this.userService.delete(userId);
    return "L'utilisateur a été supprimé";
  }

  @UseGuards(UsersGuard)
  @Get('access')
  @ApiNoContentResponse({ description: 'Vous etes Autorisé !' })
  access(): string {
    return 'Vous etes Autorisé !';
  }
}
