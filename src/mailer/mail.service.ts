import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import listMail from './mail.list';

@Injectable()
export class MailService {
  public port_application: number;
  public url_application: string;
  public protocol_application: string;

  constructor(private configService: ConfigService) {
    this.nodemailerconfig = {
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
    };
    this.url_application = this.configService.get<string>('URL_APPLICATION');
    this.port_application = this.configService.get<number>('PORT_APPLICATION');
    this.protocol_application = this.configService.get<string>(
      'PROTOCOL_APPLICATION',
    );
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

  async sendEmail(user: any, subject: string, temp: string) {
    const transporter = this.main();
    const mailTo = user.email;
    const mailSubject = subject;
    const mailContext = listMail[temp](user, {
      protocol: this.protocol_application,
      port: this.port_application,
      url: this.url_application,
    });
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
