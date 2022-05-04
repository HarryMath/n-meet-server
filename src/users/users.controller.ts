import { BadRequestException, Body, Controller, Get, Headers, Post, Put, UnauthorizedException } from "@nestjs/common";
import { UsersService } from './users.service';
import { IAuthorisedUser, IGuest, IUser } from "../shared/models";

@Controller('users')
export class UsersController {
  constructor(private authService: UsersService) {}

  @Get('current')
  getCurrentUser(@Headers('authorisation') token: string): IAuthorisedUser | IGuest | number {
    if (this.authService.isAuthorised(token)) {
      return this.authService.get(token);
    }
    throw new UnauthorizedException();
  }

  @Post('sign-in')
  authorise(@Body() authData: { login: string; password: string }): { token: string, user: IGuest } {
    const authState = this.authService.signIn(
      authData.login,
      authData.password,
    );
    if (authState.isSuccess) {
      return { token: authState.token, user: this.authService.get(authState.token) };
    }
    throw new BadRequestException('invalid login or password');
  }

  @Post('guest')
  authoriseGuest(
    @Headers('authorisation') token: string,
    @Body() guestData: { name: string, x: number, y: number }): { token: string, user: IGuest }
  {
    this.authService.signOut(token);
    const newToken = this.authService.addGuest(guestData.name);
    const user = this.authService.get(newToken);
    return {token: newToken, user};
  }

  @Put('sign-out')
  signOut(@Headers('authorisation') token: string): void {
    this.authService.signOut(token);
  }
}
