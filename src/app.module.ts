import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
// import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
