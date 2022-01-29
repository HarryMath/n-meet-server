import { IRoom, IRoomDetails, IRoomMember } from "./models";
export declare class Room {
    private readonly name;
    private readonly id;
    private readonly members;
    private static totalRoomsCount;
    constructor(name: string);
    getDTO(): IRoom;
    addMember(user: IRoomMember): void;
    getDetails(): IRoomDetails;
}
