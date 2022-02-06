import { Body, Controller, Get, Headers, Post, Put } from "@nestjs/common";
import { AuthService, ResponseCodes } from '../services/auth.service';
import { IAuthorisedUser, IGuest, IUser } from "../models/models";

@Controller('users')
export class UsersController {
  constructor(private authService: AuthService) {}

  @Get('current')
  getCurrentUser(@Headers('authorisation') token: string): IAuthorisedUser | IGuest | number {
    if (this.authService.isAuthorised(token)) {
      return this.authService.get(token);
    }
    return ResponseCodes.UNAUTHORISED;
  }

  @Post('sign-in')
  authorise(@Body() authData: { login: string; password: string }): { token: string, user: IAuthorisedUser } | number {
    const authState = this.authService.signIn(
      authData.login,
      authData.password,
    );
    if (authState.isSuccess) { // @ts-ignore
      return { token: authState.token, user: this.authService.get(authState.token) };
    }
    return ResponseCodes.INCORRECT_LOGIN_OR_PASSWORD;
  }

  @Post('guest')
  authoriseGuest(
    @Headers('authorisation') token: string,
    @Body() guestData: { name: string, x: number, y: number }): { token: string, user: IGuest } | number
  {
    this.authService.signOut(token);
    const newToken = this.authService.addGuest(guestData.name);
    const user = this.authService.get(newToken);
    return {token: newToken, user};
  }

  @Put('sign-out')
  signOut(@Headers('authorisation') token: string): number {
    this.authService.signOut(token);
    return ResponseCodes.SUCCESS;
  }
}
