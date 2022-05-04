import { Module } from '@nestjs/common';
import { RoomsController } from './rooms/rooms.controller';
import { RoomsService } from './rooms/rooms.service';
import { RtcGateway } from "./rtc/rtc.gateway";
import { UsersService } from "./users/users.service";
import { UsersController } from "./users/users.controller";
import { RtcInterceptor } from "./rtc/rtc.interceptor";
import { RtcService } from "./rtc/rtc.service";

@Module({
  imports: [],
  controllers: [RoomsController, UsersController],
  providers: [RoomsService, UsersService, RtcGateway, RtcInterceptor, RtcService],
})
export class AppModule {}
