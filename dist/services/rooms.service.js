"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RoomsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const Room_1 = require("../models/Room");
const socket_io_1 = require("socket.io");
let RoomsService = RoomsService_1 = class RoomsService {
    constructor() {
        this.rooms = [new Room_1.Room('test')];
    }
    joinRoom(roomId, user) {
        const room = this.rooms.find(r => r.getDTO().id === roomId);
        room.addMember(user);
        return room.getDetails();
    }
    getAllRooms() {
        return this.rooms.map(r => r.getDTO());
    }
    static createSocket(httpServer) {
        RoomsService_1.io = new socket_io_1.Server(httpServer);
        RoomsService_1.io.on('connection', (client) => {
            const user = { isJoined: false, socket: client, id: client.conn.id, ip: client.conn.remoteAddress };
            console.log('a user connected: ' + user.id);
            RoomsService_1.users.push(user);
            client.on('join', () => {
                RoomsService_1.users.forEach(u => {
                    if (u.isJoined && u.id !== client.conn.id) {
                        console.log('user with id ' + user.id + ' got ' + u.id);
                        client.emit('member', { userId: u.socket.conn.id });
                    }
                });
                user.isJoined = true;
            });
            client.on('offer', payload => {
                console.log(user.id + ' |-- offer --> ' + payload.to);
                const destination = RoomsService_1.users.find(u => u.id === payload.to);
                if (destination) {
                    payload.to = undefined;
                    payload.from = user.id;
                    destination.socket.emit('offer', payload);
                }
            });
            client.on('answer', payload => {
                console.log(user.id + ' |-- answer --> ' + payload.to);
                const destination = RoomsService_1.users.find(u => u.id === payload.to);
                if (destination) {
                    payload.to = undefined;
                    payload.from = user.id;
                    destination.socket.emit('answer', payload);
                }
            });
            client.on('candidate', payload => {
                const destination = RoomsService_1.users.find(u => u.id === payload.to);
                if (destination) {
                    payload.to = undefined;
                    payload.from = user.id;
                    destination.socket.emit('candidate', payload);
                }
            });
            client.on('disconnect', () => {
                client.broadcast.emit('leave', { userId: user.id });
                console.log(user.id + ' disconnected');
                for (let i = 0; i < RoomsService_1.users.length; i++) {
                    if (RoomsService_1.users[i].id === user.id || RoomsService_1.users[i].ip === user.ip) {
                        RoomsService_1.users.splice(i--, 1);
                    }
                }
                console.log('users amount: ' + RoomsService_1.users.length + '\n');
            });
        });
    }
};
RoomsService.users = [];
RoomsService = RoomsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RoomsService);
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map