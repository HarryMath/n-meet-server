import { Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { RoomsService } from '../services/rooms.service';
import { AuthService, ResponseCodes } from '../services/auth.service';
import { IRoomDto } from '../models/models';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  getOne(@Headers('authorisation') token: string, @Param('id') roomId: string): IRoomDto | number {
    if (this.authService.isAuthorised(token)) {
      const user = this.authService.get(token);
      if (this.roomsService.hasRoom(roomId)) {
        return this.roomsService.getOne(roomId, user.socketId);
      }
      return ResponseCodes.NO_SUCH_ROOM;
    }
    return ResponseCodes.UNAUTHORISED;
  }

  @Post('create')
  createRoom(@Headers('authorisation') token: string): {roomId: string} {
    return {roomId: this.roomsService.createRoom()};
  }
}
