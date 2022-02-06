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
    password: string;
    personId: number;
}
export interface IAuthorisedUser {
    login: string;
    name: string;
    skinId: number;
    socketId: string | undefined;
    x: number;
    y: number;
    direction: 'top' | 'bottom' | 'left' | 'right';
}
export interface IGuest {
    name: string;
    skinId: number;
    socketId: string | undefined;
    x: number;
    y: number;
    direction: 'top' | 'bottom' | 'left' | 'right';
}
export interface IRoomDto {
    id: string;
    members: (IGuest | IAuthorisedUser)[];
}
export interface IJoinPayload {
    token: string;
    roomId: string;
}
export interface IMailData {
    to: string;
    subject: string;
    body: string;
}
