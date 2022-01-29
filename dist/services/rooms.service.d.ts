import { IRoom, IRoomDetails, IRoomMember } from "../models/models";
export declare class RoomsService {
    private readonly rooms;
    private static readonly users;
    private static io;
    constructor();
    joinRoom(roomId: string, user: IRoomMember): IRoomDetails;
    getAllRooms(): IRoom[];
    static createSocket(httpServer: any): void;
}
