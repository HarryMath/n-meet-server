import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsController } from './controllers/rooms.controller';
import { RoomsService } from './services/rooms.service';
import { SocketGateway } from "./gateways/socket.gateway";
import { AuthService } from "./services/auth.service";
import { UsersController } from "./controllers/users.controller";
import { MailController } from "./controllers/mail.controller";
import { MailService } from "./services/mail.service";

@Module({
  imports: [],
  controllers: [AppController, RoomsController, UsersController, MailController],
  providers: [AppService, RoomsService, AuthService, SocketGateway, MailService],
})
export class AppModule {}
