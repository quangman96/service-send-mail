import { Controller, Post } from '@nestjs/common';
import { AppService, User } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('sendmail')
  async sendEmails() {
    const users: User[] = Array.from({ length: 1 }, (_, index) => ({
      email: 'man.meo.a1@gmail.com',
      id: index + 1,
    }));
    this.appService.sendEmails(users);
    return users;
  }
}
