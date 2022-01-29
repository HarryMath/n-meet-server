import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {RoomsController} from "./controllers/rooms.controller";
import {RoomsService} from "./services/rooms.service";

@Module({
  imports: [],
  controllers: [AppController, RoomsController],
  providers: [AppService, RoomsService],
})
export class AppModule {}
