import { IAuthorisedUser, IGuest, IRoomDto } from './models';
export declare class Room {
    readonly createTimestamp: number;
    private readonly id;
    private readonly members;
    private static totalRoomsCount;
    constructor(id: string);
    addUser(user: IAuthorisedUser | IGuest): void;
    size(): number;
    getDto(exceptUserId: string): IRoomDto;
    dropUser(socketId: string): void;
}
