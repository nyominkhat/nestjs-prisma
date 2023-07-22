import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { Signin, Signup } from './dto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: Signup, response: Response) {
    const { email, password } = dto;

    // generate the password
    const hashedPassword = await argon.hash(password);

    // save the user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          hashedPassword,
        },
      });

      const acceptToken = await this.signToken(
        user.id,
        user.email,
      );

      if (!acceptToken) {
        return new ForbiddenException();
      }

      response.cookie(
        'acceptToken',
        acceptToken.access_token,
        {
          httpOnly: true,
        },
      );

      // response.clearCookie('acceptToken');

      // send token to user
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Account already exist!',
          );
        }
      }

      throw error;
    }
  }

  async signin(dto: Signin, response: Response) {
    const { email, password } = dto;

    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException(
        "Account doesn't exist!",
      );
    }

    // compare password
    const matchedPassword = await argon.verify(
      user.hashedPassword,
      password,
    );

    // if password incorrect throw exception
    if (!matchedPassword) {
      return new ForbiddenException(
        'Credentials incorrect!',
      );
    }

    const acceptToken = await this.signToken(
      user.id,
      user.email,
    );

    if (!acceptToken) {
      return new ForbiddenException();
    }

    response.cookie(
      'acceptToken',
      acceptToken.access_token,
      {
        httpOnly: true,
      },
    );

    // send token to user
    return 'signin successful!';
  }

  async logout(response: Response) {
    response.clearCookie('acceptToken');

    return 'Signout successful!';
  }

  // generate token
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET as string,
    });

    return {
      access_token: token,
    };
  }
}
