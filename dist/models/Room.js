"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    constructor(id) {
        Room.totalRoomsCount += 1;
        this.id = id;
        this.members = [];
        this.createTimestamp = Date.now();
    }
    addUser(user) {
        this.members.push(user);
    }
    size() {
        return this.members.length;
    }
    getDto(exceptUserId) {
        const members = [];
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].socketId !== exceptUserId) {
                members.push(this.members[i]);
            }
        }
        return { id: this.id, members };
    }
    dropUser(socketId) {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].socketId === socketId) {
                this.members.splice(i, 1);
                return;
            }
        }
    }
}
exports.Room = Room;
Room.totalRoomsCount = 0;
//# sourceMappingURL=Room.js.map