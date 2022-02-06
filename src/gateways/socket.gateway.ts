import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RoomsService } from '../services/rooms.service';
import { AuthService } from '../services/auth.service';
import { IJoinPayload } from '../models/models';

interface ISocketUser {
  isJoined: boolean;
  roomId: string;
  token: string;
  socket: any;
  socketId: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection {
  constructor(
    private roomsService: RoomsService,
    private authService: AuthService,
  ) {}

  @WebSocketServer() private server: Server;
  private readonly users: ISocketUser[] = [];

  handleConnection(client: any, ...args: any[]): void {
    const socketUser: ISocketUser = { isJoined: false, socket: client, socketId: client.conn.id, token: '', roomId: '', };
    console.log('[connected]  ' + socketUser.socketId);

    client.on('join', (payload: IJoinPayload) => {
      if (
        this.authService.isAuthorised(payload.token) &&
        this.roomsService.hasRoom(payload.roomId)
      ) {
        this.handleLeave(socketUser); // leave other room is already in
        const user = this.authService.get(payload.token);
        user.socketId = client.conn.id;
        this.roomsService.addUser(user, payload.roomId);
        console.log('[join]  success: ' + user.socketId);
        socketUser.token = payload.token;
        socketUser.roomId = payload.roomId;
        socketUser.isJoined = true;
        this.users.push(socketUser);
        client.emit('join', true);
      } else {
        client.emit('join', false);
        console.warn('[join]  rejected: ' + payload.token);
      }
    });

    client.on('offer', (payload) => {
      if (socketUser.isJoined && this.authService.isAuthorised(payload.token)) {
        console.log('[offer]  ' + socketUser.socketId + ' ---> ' + payload.to);
        const destination = this.users.find((u) => u.socketId === payload.to);
        if (destination) {
          const from = this.authService.get(payload.token);
          payload.token = payload.to = undefined;
          payload.from = from;
          destination.socket.emit('offer', payload);
        }
      }
    });

    client.on('aim', (payload) => {
      if (socketUser.isJoined && this.authService.isAuthorised(payload.token)) {
        const user = this.authService.get(payload.token);
        payload.token = undefined;
        payload.from = socketUser.socketId;
        this.users.forEach(u => {
          if (u.isJoined && u.roomId === socketUser.roomId && u.token != socketUser.token) {
            u.socket.emit('aim', payload);
          }
        });
        user.x = payload.aim.x;
        user.y = payload.aim.y;
      }
    })

    client.on('answer', (payload) => {
      if (this.authService.isAuthorised(payload.token)) {
        console.log('[answer]  ' + socketUser.socketId + ' ---> ' + payload.to);
        const destination = this.users.find((u) => u.socketId === payload.to);
        if (destination) {
          payload.token = payload.to = undefined;
          payload.from = socketUser.socketId;
          destination.socket.emit('answer', payload);
        }
      }
    });

    client.on('candidate', (payload) => {
      const destination = this.users.find((u) => u.socketId === payload.to);
      if (destination) {
        payload.token = payload.to = undefined;
        payload.from = socketUser.socketId;
        destination.socket.emit('candidate', payload);
      }
    });

    client.on('disconnect', () => {
      console.log('[disconnected]  ' + socketUser.socketId);
      this.handleLeave(socketUser);
      console.log('members amount: ' + this.users.length + '\n');
    });
  }

  handleLeave(user: ISocketUser): void {
    if (user.isJoined) {
      const needNotifyUsers = this.roomsService.dropUser(user.socketId, user.roomId);
      if (needNotifyUsers) {
        user.socket.broadcast.emit('leave', { userId: user.socketId });
      }
    }
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].socketId === user.socketId) {
        this.users.splice(i--, 1);
      }
    }
  }
}
