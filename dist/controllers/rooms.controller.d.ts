import { RoomsService } from '../services/rooms.service';
import { AuthService } from '../services/auth.service';
import { IRoomDto } from '../models/models';
export declare class RoomsController {
    private readonly roomsService;
    private readonly authService;
    constructor(roomsService: RoomsService, authService: AuthService);
    getOne(token: string, roomId: string): IRoomDto | number;
    createRoom(token: string): {
        roomId: string;
    };
}
