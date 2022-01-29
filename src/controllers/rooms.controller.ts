import { Controller, Get, Param, Req, UseInterceptors } from "@nestjs/common";
import {RoomsService} from "../services/rooms.service";
import { Request } from 'express';

@Controller('rooms')
export class RoomsController {

    constructor(private readonly roomsService: RoomsService) {}

    @Get('')
    getAll(): string {
        return JSON.stringify(this.roomsService.getAllRooms());
    }

    @Get(':id')
    getOne(@Param('id') id: string, @Req() request: Request): string {
        const port = String(request.socket.remotePort);
        const ip = request.socket.remoteAddress;
        return JSON.stringify(this.roomsService.joinRoom(id, {
            name: '', port, ip, login: '', password: '', photo: ''
        }))
    }

}
