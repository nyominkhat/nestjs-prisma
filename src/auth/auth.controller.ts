import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { Signin, Signup } from './dto';
import { Public } from 'src/libs/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(
    @Body() dto: Signup,

    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signup(dto, response);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(
    @Body() dto: Signin,

    @Res({ passthrough: true }) response: Response,
  ) {
    // console.log('cookies', request.cookies);

    return this.authService.signin(dto, response);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
