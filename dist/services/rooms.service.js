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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const Room_1 = require("../models/Room");
const crypto = require('crypto');
let RoomsService = class RoomsService {
    constructor() {
        this.rooms = new Map();
    }
    createRoom() {
        const roomId = this.generateRoomId();
        this.rooms.set(roomId, new Room_1.Room(roomId));
        return roomId;
    }
    getOne(roomId, exceptUserId) {
        if (this.rooms.has(roomId)) {
            return this.rooms.get(roomId).getDto(exceptUserId);
        }
        console.warn('no room with id ' + roomId);
        return { id: '', members: [] };
    }
    addUser(user, roomId) {
        if (this.rooms.has(roomId)) {
            this.rooms.get(roomId).addUser(user);
        }
    }
    hasRoom(roomId) {
        return this.rooms.has(roomId);
    }
    dropUser(socketId, roomId) {
        if (!this.rooms.has(roomId)) {
            console.warn('[dropUser] no room with id "' + roomId + '"');
            return false;
        }
        const room = this.rooms.get(roomId);
        room.dropUser(socketId);
        if (room.size() > 0) {
            return true;
        }
        else {
            if (Date.now() - room.createTimestamp > 1000 * 60 * 60) {
                this.rooms.delete(roomId);
            }
            return false;
        }
    }
    dropUnusedRooms() {
    }
    generateRoomId() {
        const dataToEncrypt = String(this.rooms.size + Math.random());
        return crypto.createHash('md5')
            .update(dataToEncrypt)
            .digest('hex')
            .substring(0, 7) + this.rooms.size;
    }
};
RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RoomsService);
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map