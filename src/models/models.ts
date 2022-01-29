export interface IEvent {
    name: string;
    startHours: number;
    startMinutes: number;
    minutesDuration: number;
    color: string;
    startDate: number;
    repeatInterval: number;
    repeatTimes: number;
}

export interface IUser {
    login: string;
    name: string;
    password: string|undefined;
    photo: string|undefined;
}

export interface IRoomMember {
    login: string;
    name: string;
    password: string|undefined;
    photo: string|undefined;
    ip: string;
    port: string;
}

export interface IRoom {
    name: string;
    id: string;
}

export interface IRoomDetails {
    name: string;
    id: string;
    members: IRoomMember[]
}
