import { Injectable } from '@nestjs/common';
import {IRoom, IRoomDetails, IRoomMember} from "../models/models";
import {Room} from "../models/Room";
import { Server } from "socket.io";

@Injectable()
export class RoomsService {

    private readonly rooms: Room[];
    private static readonly users: {isJoined: boolean, socket: any}[] = [];
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
            const user = {isJoined: false, socket: client};
            console.log('a user connected: ' + client.conn.id);
            RoomsService.users.push(user);

            client.on('get-members', () => {
                RoomsService.users.forEach(u => {
                    if (u.isJoined && u.socket.conn.id !== client.conn.id) {
                        console.log('user with id ' + client.conn.id + ' got ' + u.socket.conn.id);
                        client.emit('member', {userId: u.socket.conn.id});
                    }
                });
                user.isJoined = true;
            });

            client.on('offer', payload => {
                console.log(client.conn.id + ' |-- offer --> ' + payload.to);
                const destination = RoomsService.users.find(u => u.socket.conn.id === payload.to);
                if (destination) {
                    payload.to = undefined;
                    payload.from = client.conn.id;
                    destination.socket.emit('offer', payload);
                }
            });

            client.on('answer', payload => {
                console.log(client.conn.id + ' |-- answer --> ' + payload.to);
                const destination = RoomsService.users.find(u => u.socket.conn.id === payload.to);
                if (destination) {
                    payload.to = undefined;
                    payload.from = client.conn.id;
                    destination.socket.emit('answer', payload);
                }
            });

            client.on('candidate', payload => {
                const destination = RoomsService.users.find(u => u.socket.conn.id === payload.to);
                if (destination) {
                    payload.to = undefined;
                    payload.from = client.conn.id;
                    console.log(client.conn.id + ' |-- candidate --> ' + payload.to);
                    destination.socket.emit('candidate', payload);
                }
            });

            client.on('disconnect', () => {
               client.broadcast.emit('leave', {userId: client.conn.id});
               console.log(client.conn.id + ' disconnected');
               const i = RoomsService.users.indexOf(client);
               RoomsService.users.splice(i, 1);
               console.log('users amount: ' + RoomsService.users.length);
            });
        })
    }


}
