export class MailServiceMock {
  sendEmail = jest.fn().mockResolvedValue(true);
}
