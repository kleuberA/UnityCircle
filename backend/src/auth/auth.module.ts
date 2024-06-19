import { jwtConstants } from './jwt.strategy/constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      global: true,
    }),
  ],
  providers: [AuthService, PrismaService, ConfigService, JwtService],
  exports: [JwtService, AuthService],
})
export class AuthModule { }
