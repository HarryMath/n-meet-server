import { Injectable } from '@nestjs/common';
import {IRoom, IRoomDetails, IRoomMember} from "../models/models";
import {Room} from "../models/Room";
import { Server } from "socket.io";

export interface IUser {
    isJoined: boolean;
    socket: any;
    id: string;
    ip: string;
}

@Injectable()
export class RoomsService {

    private readonly rooms: Room[];
    private static readonly users: IUser[] = [];
    private static io;

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

    public static createSocket(httpServer): void {
        RoomsService.io = new Server(httpServer);
        RoomsService.io.on('connection', (client) => {
            const user = {isJoined: false, socket: client, id: client.conn.id, ip: client.conn.remoteAddress};
            console.log('[connected]  ' + user.id);
            RoomsService.users.push(user);

            client.on('join', () => {
                RoomsService.users.forEach(u => {
                    console.log('[joined]  ' + user.id);
                    if (u.isJoined && u.id !== user.id) {
                        console.log(user.id + ' <-- got --| ' + u.id);
                        client.emit('member', {userId: u.id});
                    }
                });
                user.isJoined = true;
            });

            client.on('offer', payload => {
                console.log('[offer]  ' + user.id + ' ---> ' + payload.to);
                const destination = RoomsService.users.find(u => u.id === payload.to);
                if (destination) {
                    payload.to = undefined;
                    payload.from = user.id;
                    destination.socket.emit('offer', payload);
                }
            });

            client.on('answer', payload => {
                console.log('[answer]  ' + user.id  + ' ---> ' + payload.to);
                const destination = RoomsService.users.find(u => u.id === payload.to);
                if (destination) {
                    payload.to = undefined;
                    payload.from = user.id;
                    destination.socket.emit('answer', payload);
                }
            });

            client.on('candidate', payload => {
                const destination = RoomsService.users.find(u => u.id === payload.to);
                if (destination) {
                    payload.to = undefined;
                    payload.from = user.id;
                    destination.socket.emit('candidate', payload);
                }
            });

            client.on('disconnect', () => {
               client.broadcast.emit('leave', {userId: user.id});
               console.log('[disconnected]  ' + user.id);
               for (let i = 0; i < RoomsService.users.length; i++) {
                   if (RoomsService.users[i].id === user.id || RoomsService.users[i].ip === user.ip) {
                       RoomsService.users.splice(i--, 1);
                   }
               }
               console.log('users amount: ' + RoomsService.users.length + '\n');
            });
        })
    }


}
