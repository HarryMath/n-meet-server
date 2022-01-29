import { IRoom, IRoomDetails, IRoomMember } from "../models/models";
export declare class RoomsService {
    private readonly rooms;
    constructor();
    joinRoom(roomId: string, user: IRoomMember): IRoomDetails;
    getAllRooms(): IRoom[];
}
