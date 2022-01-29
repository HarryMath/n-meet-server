import {IRoom, IRoomDetails, IRoomMember} from "./models";

export class Room {

    private readonly name: string;
    private readonly id: string;
    private readonly members: IRoomMember[]
    private static totalRoomsCount = 0;

    constructor(name: string) {
        Room.totalRoomsCount += 1;
        this.id = String(Room.totalRoomsCount);
        this.name = name;
        this.members = [];
    }

    public getDTO(): IRoom {
        return {id: this.id, name: this.name};
    }

    public addMember(user: IRoomMember): void {
        this.members.push(user);
        //this.io.sockets.emit('newMember', JSON.stringify(user));
    }

    public getDetails(): IRoomDetails {
        return {id: this.id, name: this.name, members: this.members};
    }
}
