import {
  ConflictException,
  Injectable,
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

@Injectable()
export class UsersService {
  constructor(
    private readonly repositoriesService: RepositoriesService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(
        parseInt(this.configService.get('SALT_ROUNDS')),
      );
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new ConflictException(
        'Erreur lors du hashage du password ' + error,
      );
    }
  }

  async signup(signupUserDto: SignupUserDto): Promise<Users> {
    const { email, password } = signupUserDto;
    const userExist = await this.repositoriesService.users.findFirst({
      where: { email: email },
    });
    if (userExist) {
      throw new ConflictException('User already exist');
    }
    signupUserDto.password = await this.hashPassword(password);
    const user = await this.repositoriesService.users.create({data: signupUserDto});
    await this.mailService.sendEmail(user.email, 'user Created', 'create_user');
    return user;
  }

  async signin(signinUserDto: SigninUserDto): Promise<any> {
    const { email, password } = signinUserDto;
    const userExist = await this.repositoriesService.users.findFirst({
      where: { email: email },
    });
    if (!userExist) {
      throw new NotFoundException('User not found');
    }
    if (!(await bcrypt.compare(password, userExist.password))) {
      throw new UnauthorizedException('Le mot de passe est incorrect');
    }
    const payload = { sub: userExist.userId };

    return {
      access_token: await this.jwtService.signAsync(payload),
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
    const newPassword = await this.hashPassword(
      updateUserPasswordDto.newPassword,
    );
    return await this.repositoriesService.users.update({
      where: { userId: userId },
      data: { password: newPassword },
      include: { order: true },
    });
  }

  async update(updateUserDto: UpdateUserDto, userId: string): Promise<Users> {
    await this.findById(userId);
    return await this.repositoriesService.users.update({
      where: { userId: userId },
      data: updateUserDto,
      include: { order: true },
    });
  }

  async getProfil(userId: string): Promise<Users> {
    return await this.findById(userId);
  }

  async delete(userId: string): Promise<Users> {
    await this.findById(userId);
    return await this.repositoriesService.users.delete({
      where: { userId: userId },
      include: { order: true },
    });
  }

  async findById(userId: string): Promise<Users> {
    const user = await this.repositoriesService.users.findUnique({
      where: { userId: userId },
      include: { order: true },
    });
    if (!user) {
      throw new NotFoundException(`UserId : ${userId} not found`);
    }
    return user;
  }
}
