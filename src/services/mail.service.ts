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
        pass: 'Mathpop22091337'
      }
    });
  }

  async send(to: string, subject: string, body: string): Promise<{ isSuccess: boolean, message: string }> {
    const message = {from: this.from, to, subject, text: body};
    try {
      const result = await this.transporter.sendMail(message);
      if (result.rejected) {
        return {isSuccess: false, message: result.response};
      } else {
        return {isSuccess: true, message: 'success'};
      }
    } catch (e) {
      return {isSuccess: false, message: e};
    }
  }

}
