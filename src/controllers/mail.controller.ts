import { Body, Controller, Post } from "@nestjs/common";
import { IMailData } from "../models/models";
import { MailService } from "../services/mail.service";

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService
  ) {}

  @Post('send')
  async sendMail(@Body() mailData: IMailData): Promise<{ isSuccess: boolean, message: string }> {
    return await this.mailService.send(mailData.to, mailData.subject, mailData.body);
  }
}
