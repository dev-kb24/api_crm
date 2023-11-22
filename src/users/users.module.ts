import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from '@/mailer/mail.service';

@Module({
  imports: [
    ConfigModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService], 
    }),
  ],
  providers: [UsersService,MailService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}