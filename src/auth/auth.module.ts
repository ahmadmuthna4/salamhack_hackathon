import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Bcrypt } from 'src/user/classes/bcrypt.class';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guard/jwt.guard';
import { JwtStrategy } from './jwt-strategy';
import { UserModule } from 'src/user/user.module';
import { RedisTokens } from './classes/redis-tokens.class';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule],
  controllers: [AuthController],
  providers:
    [
      AuthService,
      AuthRepository,
      JwtService,
      JwtAuthGuard,
      JwtStrategy,
      RedisTokens
    ]
})
export class AuthModule { }
