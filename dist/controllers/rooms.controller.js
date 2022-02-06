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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const rooms_service_1 = require("../services/rooms.service");
const auth_service_1 = require("../services/auth.service");
let RoomsController = class RoomsController {
    constructor(roomsService, authService) {
        this.roomsService = roomsService;
        this.authService = authService;
    }
    getOne(token, roomId) {
        if (this.authService.isAuthorised(token)) {
            const user = this.authService.get(token);
            if (this.roomsService.hasRoom(roomId)) {
                return this.roomsService.getOne(roomId, user.socketId);
            }
            return auth_service_1.ResponseCodes.NO_SUCH_ROOM;
        }
        return auth_service_1.ResponseCodes.UNAUTHORISED;
    }
    createRoom(token) {
        return { roomId: this.roomsService.createRoom() };
    }
};
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Headers)('authorisation')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Object)
], RoomsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Headers)('authorisation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], RoomsController.prototype, "createRoom", null);
RoomsController = __decorate([
    (0, common_1.Controller)('rooms'),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        auth_service_1.AuthService])
], RoomsController);
exports.RoomsController = RoomsController;
//# sourceMappingURL=rooms.controller.js.map