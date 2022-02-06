import { Injectable } from '@nestjs/common';
import { IAuthorisedUser, IGuest, IRoomDto } from '../models/models';
import { Room } from '../models/Room';
const crypto = require('crypto');

@Injectable()
export class RoomsService {
  private readonly rooms: Map<string, Room> = new Map<string, Room>();
  private static io;

  constructor() {}

  createRoom(): string {
    const roomId = this.generateRoomId();
    this.rooms.set(roomId, new Room(roomId));
    return roomId;
  }

  getOne(roomId: string, exceptUserId: string): IRoomDto {
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId).getDto(exceptUserId);
    }
    console.warn('no room with id ' + roomId);
    return { id: '', members: [] };
  }

  addUser(user: IAuthorisedUser | IGuest, roomId: string) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).addUser(user);
    }
  }

  hasRoom(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  dropUser(socketId: string, roomId: string): boolean {
    if (!this.rooms.has(roomId)) {
      console.warn('[dropUser] no room with id "' + roomId + '"');
      return false;
    }
    const room = this.rooms.get(roomId);
    room.dropUser(socketId);
    if (room.size() > 0) {
      return true;
    } else {
      // remove room if there are no members and it was created more than 1 hour ago;
      if (Date.now() - room.createTimestamp > 1000 * 60 * 60) {
        this.rooms.delete(roomId);
      }
      return false;
    }
  }


  private dropUnusedRooms(): void {

  }

  private generateRoomId(): string {
    const dataToEncrypt = String(this.rooms.size + Math.random())
    return crypto.createHash('md5')
      .update(dataToEncrypt)
      .digest('hex')
      .substring(0, 7) + this.rooms.size;
  }

}
