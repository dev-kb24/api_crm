import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RepositoriesService } from '@/repositories/repositories.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config/dist';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/mailer/mail.service';
import { Users } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(
    private readonly repositoriesService: RepositoriesService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  private async hash(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(
        parseInt(this.configService.get('SALT_ROUNDS')),
      );
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new ConflictException('Erreur lors du hashage ' + error);
    }
  }

  async signup(signupUserDto: SignupUserDto): Promise<Users> {
    let user: Users;
    const { email, password } = signupUserDto;

    const userExist: Users = await this.findByEmail(email);

    if (userExist) {
      throw new ConflictException('User already exist');
    }

    signupUserDto.password = await this.hash(password);
    let code_email: string = (
      Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000
    ).toString();
    if (this.configService.get('NODE_ENV') === 'test') {
      code_email = signupUserDto.code_email;
    }
    signupUserDto.code_email = await this.hash(code_email);
    try {
      user = await this.repositoriesService.users.create({
        data: signupUserDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
    const dataMail = {
      email: signupUserDto.email,
      code_email: code_email,
    };
    await this.mailService.sendEmail(dataMail, 'user Created', 'create_user');

    return user;
  }

  async signin(signinUserDto: SigninUserDto): Promise<any> {
    const { email, password } = signinUserDto;
    const userExist: Users = await this.findByEmail(email);

    if (!userExist) {
      throw new NotFoundException('User not found');
    }

    if (!userExist.user_is_valid) {
      throw new UnauthorizedException("Votre compte n'a pas été validé");
    }

    if (!(await bcrypt.compare(password, userExist.password))) {
      throw new UnauthorizedException('Le mot de passe est incorrect');
    }
    const payload = { sub: userExist.userId };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userExist,
    };
  }

  async updatePassword(
    updateUserPasswordDto: UpdateUserPasswordDto,
    userId: string,
  ): Promise<Users> {
    const userExist = await this.findById(userId);
    if (
      !(await bcrypt.compare(
        updateUserPasswordDto.oldPassword,
        userExist.password,
      ))
    ) {
      throw new ConflictException('Le mot de passe est incorrect');
    }
    const newPassword: string = await this.hash(
      updateUserPasswordDto.newPassword,
    );
    return await this.updateUser(
      { userId: userId },
      { password: newPassword },
      { order: true },
    );
  }

  async update(updateUserDto: UpdateUserDto, userId: string): Promise<Users> {
    await this.findById(userId);
    return await this.updateUser({ userId: userId }, updateUserDto, {
      order: true,
    });
  }

  async getProfil(userId: string): Promise<Users> {
    return await this.findById(userId);
  }

  async delete(userId: string): Promise<Users> {
    let user: Users;
    await this.findById(userId);
    try {
      user = await this.repositoriesService.users.delete({
        where: { userId: userId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
    return user;
  }

  async validation(code_email: string, userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!(await bcrypt.compare(code_email, user.code_email))) {
      throw new BadRequestException(
        "Votre code de confirmation n'est pas le bon",
      );
    }

    await this.updateUser({ userId: userId }, { user_is_valid: true });

    return true;
  }

  async findById(userId: string): Promise<Users> {
    let user: Users;
    try {
      user = await this.repositoriesService.users.findUnique({
        where: { userId: userId },
        include: { order: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
    if (!user) {
      throw new NotFoundException(`UserId : ${userId} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<Users | null> {
    let user: Users;
    try {
      user = await this.repositoriesService.users.findFirst({
        where: { email: email },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }

    return user;
  }

  async updateUser(where: any, data: any, include?: any): Promise<Users> {
    try {
      return await this.repositoriesService.users.update({
        where,
        data,
        include,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
