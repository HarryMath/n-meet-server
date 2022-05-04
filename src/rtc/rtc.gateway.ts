import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import {
  IWsClient,
  IJoinPayload,
  IPoint,
  IRtcUserPackage,
  IRtcUser,
  IRtcUserInfo
} from "../shared/models";
import { RtcService } from "./rtc.service";
import { UseInterceptors } from "@nestjs/common";
import { RtcInterceptor } from "./rtc.interceptor";

@UseInterceptors(RtcInterceptor)
@WebSocketGateway({ cors: { origin: '*' } })
export class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private roomsService: RoomsService,
    private authService: UsersService,
    private rtcService: RtcService,
  ) {}

  @WebSocketServer() private server: Server;

  handleConnection(client: IWsClient, ...args: any[]): void {
    this.rtcService.registerUser(client);
  }

  @SubscribeMessage('join')
  handleJoinRoom(client: IRtcUser, data: IJoinPayload): void {
    const info: IRtcUserInfo = this.rtcService.getInfo(client.conn.id);
    if (
      this.authService.isAuthorised(data.token) &&
      this.roomsService.hasRoom(data.roomId)
    ) {
      this.handleLeave(client); // leave other rooms
      const user = this.authService.get(data.token);
      user.socketId = client.conn.id;
      this.roomsService.addUser(user, data.roomId);
      console.log('[join]  success: ' + user.socketId);
      info.token = data.token;
      info.roomId = data.roomId;
      info.isJoined = true;
      client.emit('join', true);
    } else {
      client.emit('join', false);
      console.warn('[join]  rejected: ' + data.token);
    }
  }

  @SubscribeMessage('offer')
  handleOffer(client: IRtcUser, data: IRtcUserPackage & any): void {
    if (client.rtcInfo.isJoined && this.authService.isAuthorised(data.token)) {
      console.log('[offer]  ' + client.rtcInfo.socketId + ' ---> ' + data.to);
      const destination = this.rtcService.getClient(data.to);
      if (destination) {
        const from = this.authService.get(data.token);
        data.token = data.to = undefined;
        data.from = from;
        destination.emit('offer', data);
      }
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(client: IRtcUser, data: IRtcUserPackage & any): void {
    if (this.authService.isAuthorised(data.token)) {
      console.log('[answer]  ' + client.rtcInfo.socketId + ' ---> ' + data.to);
      const destination = this.rtcService.getClient(data.to);
      if (destination) {
        data.token = data.to = undefined;
        data.from = client.rtcInfo.socketId;
        destination.emit('answer', data);
      }
    }
  }

  @SubscribeMessage('candidate')
  handleCandidate(client: IRtcUser, data: IRtcUserPackage & any): void {
    const destination = this.rtcService.getClient(data.to);
    if (destination) {
      data.token = data.to = undefined;
      data.from = client.rtcInfo.socketId;
      destination.emit('candidate', data);
    }
  }

  @SubscribeMessage('aim')
  handleAim(client: IRtcUser, data: IRtcUserPackage & {aim: IPoint}) {
    if (client.rtcInfo.isJoined && this.authService.isAuthorised(data.token)) {
      const user = this.authService.get(data.token);
      data.token = undefined;
      data.from = client.rtcInfo.socketId;
      const users = this.rtcService.getUsers(
        u => u.rtcInfo.isJoined &&
        u.rtcInfo.roomId === client.rtcInfo.roomId
      );
      users.forEach(u => u.emit('aim', data));
      user.x = data.aim.x;
      user.y = data.aim.y;
    }
  }

  handleDisconnect(client: IRtcUser): void {
    console.log('[disconnected]  ' + client.rtcInfo.socketId);
    this.handleLeave(client);
  }

  private handleLeave(user: IRtcUser): void {
    if (user.isJoined) {
      const needNotifyUsers = this.roomsService.dropUser(user.socketId, user.roomId);
      if (needNotifyUsers) {
        user.socket.broadcast.emit('leave', { userId: user.socketId });
      }
    }
    this.rtcService.delete(user.rtcInfo.socketId);
  }
}
