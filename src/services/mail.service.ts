import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class MailService {

  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private readonly from = 'nikitabort22092000@gmail.com';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.from,
        pass: 'ouupznxoqzsqtjwg'
      }
    });
    this.transporter.verify()
      .then(() => console.log('[mail verify] success'))
      .catch((e) => console.log('[mail verify] error: ' + e));
  }

  async send(to: string, subject: string, body: string): Promise<{ isSuccess: boolean, message: string }> {
    const message = {from: this.from, to, subject, text: body};
    try {
      const result = await this.transporter.sendMail(message);
      if (result.accepted.length > 0) {
        return {isSuccess: true, message: result.response};
      } else {
        return {isSuccess: false, message: result.response};
      }
    } catch (e) {
      return {isSuccess: false, message: e};
    }
  }

}
