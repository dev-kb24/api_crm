export class MockConfigService {
  get(key: string): any {
    if (key === 'MAIL_HOST') {
      return 'smtp.example.com';
    }
    if (key === 'MAIL_PORT') {
      return 587;
    }
    return null;
  }
}
