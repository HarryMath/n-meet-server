import { Injectable } from '@nestjs/common';
import { IAuthorisedUser, IGuest, IUser } from '../models/models';
const crypto = require('crypto');

export const ResponseCodes = {
  INCORRECT_LOGIN_OR_PASSWORD: -4,
  NO_SUCH_ROOM: -3,
  UNAUTHORISED: -2,
  HTTP_ERROR: -1,
  SUCCESS: 0,
};

@Injectable()
export class AuthService {
  private readonly dbUsers: IUser[] = [
    { login: 'Mikilangelo', name: 'Mikita', password: AuthService.passwordHash('popa'), personId: 1, },
    { login: 'Dashka', name: 'Dasha', password: AuthService.passwordHash('popa'), personId: 2, },
  ];

  private readonly users: Map<string, IAuthorisedUser | IGuest> = new Map<
    string,
    IAuthorisedUser | IGuest
  >();

  public isAuthorised(token: string): boolean {
    return this.users.has(token);
  }

  public get(token: string): IAuthorisedUser | IGuest {
    return this.users.get(token);
  }

  public addGuest(name: string): string {
    const token = this.generateToken();
    this.users.set(token, {
      name,
      socketId: undefined,
      skinId: name.endsWith('a') ? 2 : 1,
      x: 10 + Math.random() * 50,
      y: 10 + Math.random() * 50,
      direction: 'bottom'
    });
    return token;
  }

  public signIn(login: string, password: string,): { isSuccess: boolean; token: string } {
    let isSuccess = false;
    let token = '';
    let user: IUser;
    for (let i = 0; i < this.dbUsers.length; i++) {
      user = this.dbUsers[i];
      if (user.login === login && user.password === AuthService.passwordHash(password)) {
        isSuccess = true;
        token = this.generateToken();
        this.users.set(token, AuthService.getUserDto(user));
        break;
      }
    }
    return { isSuccess, token };
  }

  public signOut(token: string): void {
    this.users.delete(token);
  }

  private static getUserDto(u: IUser): IAuthorisedUser {
    return {
      login: u.login,
      name: u.name,
      skinId: u.login.endsWith('a') ? 2 : 1,
      socketId: undefined,
      direction: 'bottom',
      x: 10 + Math.random() * 50,
      y: 10 + Math.random() * 50
    };
  }

  private static passwordHash(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  private generateToken(): string {
    const dataToEncrypt = String(this.users.size * 3 + Math.random());
    return crypto.createHash('MD5').update(dataToEncrypt).digest('base64');
  }
}
