import {
  Controller,
  Get,
  Req,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  @Get('me')
  getMe(@Req() req: Request) {
    console.log('cookies', req.cookies);

    return req.user;
  }
}
