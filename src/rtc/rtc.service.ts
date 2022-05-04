import { Injectable } from "@nestjs/common";
import { IRtcUser, IRtcUserInfo, IWsClient } from "../shared/models";

@Injectable()
export class RtcService {

  private readonly users: IRtcUser[] = [];

  registerUser(client: IWsClient): void {
    const info: IRtcUserInfo = {isJoined: false, socketId: client.conn.id, token: '', roomId: ''};
    client.rtcInfo = info;
    this.users.push(client);
  }

  getUsers(filterCriteria: (u: IRtcUser) => boolean): IRtcUser[] {
    return this.users.filter(filterCriteria);
  }

  getClient(socketId: string): IRtcUser {
    return this.users.find(u => u.rtcInfo.socketId === socketId);
  }

  getInfo(socketId: string): IRtcUserInfo | null {
    const client = this.users.find(u => u.rtcInfo.socketId === socketId);
    return client ? client.rtcInfo : client;
  }

  delete(socketId: string): void {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].rtcInfo.socketId === socketId) {
        this.users.splice(i, 0);
        return;
      }
    }
  }
}
