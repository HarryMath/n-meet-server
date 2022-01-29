"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    constructor(name) {
        Room.totalRoomsCount += 1;
        this.id = String(Room.totalRoomsCount);
        this.name = name;
        this.members = [];
    }
    getDTO() {
        return { id: this.id, name: this.name };
    }
    addMember(user) {
        this.members.push(user);
    }
    getDetails() {
        return { id: this.id, name: this.name, members: this.members };
    }
}
exports.Room = Room;
Room.totalRoomsCount = 0;
//# sourceMappingURL=Room.js.map