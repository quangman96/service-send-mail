import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { from, interval, mergeMap, take, timer } from 'rxjs';

export interface User {
  email: string;
  id: number;
}

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}
  sendEmails(users: User[]): void {
    const batchSize = 8; // Số lượng email gửi trong mỗi lần
    const intervalTime = 1000; // Khoảng thời gian giữa các lần gửi (1 giây)

    const totalBatches = Math.ceil(users.length / batchSize);

    const startTime = new Date(); // Thời gian bắt đầu

    // Tạo một observable để gửi email từng batch một
    const observable = interval(intervalTime).pipe(
      take(totalBatches),
      mergeMap((batchIndex) => {
        const startIdx = batchIndex * batchSize;
        const endIdx = Math.min((batchIndex + 1) * batchSize, users.length);
        const batch = users.slice(startIdx, endIdx);

        // Gửi email cho từng người dùng trong batch này
        const emailPromises = batch.map((user: User) =>
          this.sendEmailToUser(user),
        );

        return from(Promise.all(emailPromises));
      }),
    );

    // Chạy observable để bắt đầu quá trình gửi email
    observable.subscribe({
      next: () => {
        // Đã hoàn thành gửi một batch
        console.log(`Batch completed at ${new Date().toLocaleTimeString()}`);
      },
      complete: () => {
        // Quá trình gửi email hoàn thành
        const endTime = new Date();
        console.log(`All emails sent. `);
        console.log(startTime.toString());
        console.log(endTime.toString());
      },
      error: (error) => {
        console.error('Error sending emails:', error);
      },
    });
    
  }

  async sendEmailToUser(user: User): Promise<void> {
    // Sử dụng nodemailer để gửi email cho user
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Test send mail subject ${user.id}`,
      text: `Test send mail content ${user.id}`,
    });
  }
}
