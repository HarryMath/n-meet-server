import { IAuthorisedUser, IGuest, IRoomDto } from '../shared/models';

export class Room {
  public readonly createTimestamp: number;
  private readonly id: string;
  private readonly members: (IAuthorisedUser | IGuest)[];
  private static totalRoomsCount = 0;

  constructor(id: string) {
    Room.totalRoomsCount += 1;
    this.id = id;
    this.members = [];
    this.createTimestamp = Date.now();
  }

  public addUser(user: IAuthorisedUser | IGuest) {
    this.members.push(user);
  }

  public size(): number {
    return this.members.length;
  }

  public getDto(exceptUserId: string): IRoomDto {
    const members = [];
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].socketId !== exceptUserId) {
        members.push(this.members[i]);
      }
    }
    return { id: this.id, members };
  }

  public dropUser(socketId: string): void {
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].socketId === socketId) {
        this.members.splice(i, 1);
        return;
      }
    }
  }
}
