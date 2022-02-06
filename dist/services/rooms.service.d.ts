import { IAuthorisedUser, IGuest, IRoomDto } from '../models/models';
export declare class RoomsService {
    private readonly rooms;
    private static io;
    constructor();
    createRoom(): string;
    getOne(roomId: string, exceptUserId: string): IRoomDto;
    addUser(user: IAuthorisedUser | IGuest, roomId: string): void;
    hasRoom(roomId: string): boolean;
    dropUser(socketId: string, roomId: string): boolean;
    private dropUnusedRooms;
    private generateRoomId;
}
