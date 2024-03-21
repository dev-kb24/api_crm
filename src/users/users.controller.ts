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
  Req,
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
import { OutputSigninDto } from './dto/output-signin.dto';
import { plainToInstance } from 'class-transformer';
import { Users } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  @ApiOkResponse({ description: 'Opération réussie', type: OutputUserDto })
  @ApiBody({ type: SignupUserDto })
  async signup(@Body() signupUserDto: SignupUserDto): Promise<OutputUserDto> {
    return plainToInstance(
      OutputUserDto,
      await this.userService.signup(signupUserDto),
      { excludeExtraneousValues: true },
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signin')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Opération réussie', type: OutputUserDto })
  @ApiBody({ type: SigninUserDto })
  async signin(@Body() signinUserDto: SigninUserDto): Promise<OutputSigninDto> {
    return plainToInstance(
      OutputSigninDto,
      await this.userService.signin(signinUserDto),
      { excludeExtraneousValues: true },
    );
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
    return plainToInstance(
      OutputUserDto,
      await this.userService.getProfil(userId),
      { excludeExtraneousValues: true },
    );
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
    return plainToInstance(
      OutputUserDto,
      await this.userService.update(updateUserDto, userId),
      { excludeExtraneousValues: true },
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Delete(':id')
  @ApiNoContentResponse({ description: 'Le produit à été supprimé' })
  async delete(@Param('id') userId: string): Promise<string> {
    await this.userService.delete(userId);
    return "L'utilisateur a été supprimé";
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UsersGuard)
  @Get('access')
  @ApiOkResponse({ description: 'Opération réussie', type: OutputUserDto })
  async access(@Req() req: any): Promise<OutputUserDto> {
    const user: Users = await this.userService.getProfil(req.user.sub.userId);
    return plainToInstance(OutputUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put('validation/:id')
  async validation(
    @Body('code_email') code_email: string,
    @Param('id') userId: string,
  ): Promise<string> {
    await this.userService.validation(code_email, userId);
    return 'Votre compte est validé';
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('forgot')
  @HttpCode(200)
  async forgot(@Body('email') email: string): Promise<string> {
    await this.userService.forgot(email);
    return 'Un email à été envoyé!';
  }
}
