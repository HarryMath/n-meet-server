import { Controller, Get, Headers, NotFoundException, Param, Post, UnauthorizedException } from "@nestjs/common";
import { RoomsService } from './rooms.service';
import { UsersService } from '../users/users.service';
import { IRoomDto } from '../shared/models';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly authService: UsersService,
  ) {}

  @Get(':id')
  getOne(
    @Headers('Authorization') token: string,
    @Param('id') roomId: string
  ): IRoomDto
  {
    if (this.authService.isAuthorised(token)) {
      const user = this.authService.get(token);
      if (this.roomsService.hasRoom(roomId)) {
        return this.roomsService.getOne(roomId, user.socketId);
      }
      throw new NotFoundException('no such room');
    }
    throw new UnauthorizedException();
  }

  @Post('create')
  createRoom(): {roomId: string} {
    return {roomId: this.roomsService.createRoom()};
  }
}
