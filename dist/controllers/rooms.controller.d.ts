import { RoomsService } from "../services/rooms.service";
import { Request } from 'express';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    getAll(): string;
    getOne(id: string, request: Request): string;
}
