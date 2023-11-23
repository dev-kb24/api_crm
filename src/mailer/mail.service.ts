import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import listMail from './mail.list';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {
    this.nodemailerconfig = {
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
    };
  }

  private nodemailerconfig = {};

  private main() {
    return createTransport(this.nodemailerconfig);
  }

  private prepareTemplate() {
    const templatePath = path.join(
      process.cwd(),
      './public/mail_templates/mail.template.hbs',
    );
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    return Handlebars.compile(templateContent);
  }

  async sendEmail(to: string, subject: string, temp: string) {
    const transporter = this.main();
    const mailTo = to;
    const mailSubject = subject;
    const mailContext = listMail[temp];
    const template = this.prepareTemplate();
    const html = template(mailContext);
    await transporter.sendMail({
      from: 'admin@admin.fr',
      to: mailTo,
      subject: mailSubject,
      html: html,
    });
  }
}
