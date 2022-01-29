import { Injectable } from '@nestjs/common';
import {IRoom, IRoomDetails, IRoomMember} from "../models/models";
import {Room} from "../models/Room";

@Injectable()
export class RoomsService {

    private readonly rooms: Room[];

    constructor() {
        this.rooms = [new Room('test')];
    }

    joinRoom(roomId: string, user: IRoomMember): IRoomDetails {
        const room = this.rooms.find(r => r.getDTO().id === roomId);
        room.addMember(user);
        return room.getDetails();
    }

    getAllRooms(): IRoom[] {
        return this.rooms.map(r => r.getDTO());
    }
}
