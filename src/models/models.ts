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
  login: string; // unique
  name: string; // default login
  password: string;
  personId: number; // default login.endsWith('a') ? 2 : 1
}

export interface IAuthorisedUser {
  login: string; // unique
  name: string; // default login
  skinId: number; // default login.endsWith('a') ? 2 : 1
  socketId: string | undefined;
  x: number;
  y: number;
  direction: 'top'|'bottom'|'left'|'right'
}

export interface IGuest {
  name: string;
  skinId: number; // default name.endsWith('a') ? 2 : 1
  socketId: string | undefined;
  x: number;
  y: number;
  direction: 'top'|'bottom'|'left'|'right'
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
  to: string,
  subject: string,
  body: string
}
