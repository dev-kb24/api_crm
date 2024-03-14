import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/mailer/mail.service';
import { MockConfigService } from '@/mailer/mocks/mail.config.mock';

describe('MailService', () => {
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useClass: MockConfigService },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  it('should send email', async () => {
    const user = { email: 'test@example.com' };
    const subject = 'Test Subject';
    const temp = 'create_user';

    const mockTransporter = {
      sendMail: jest.fn().mockResolvedValueOnce({}),
    };
    jest.spyOn(mailService as any, 'main').mockReturnValue(mockTransporter);

    const mockTemplate = jest
      .fn()
      .mockReturnValue('<html><body>Test</body></html>');
    jest
      .spyOn(mailService as any, 'prepareTemplate')
      .mockReturnValue(mockTemplate);

    await mailService.sendEmail(user as any, subject, temp);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'admin@admin.fr',
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<html><body>Test</body></html>',
    });
  });
});
