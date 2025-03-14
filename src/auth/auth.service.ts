import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Bcrypt } from 'src/user/classes/bcrypt.class';
import { response } from 'express';
import { RedisTokens } from './classes/redis-tokens.class';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
 

@Injectable()
export class AuthService {
  constructor(
    private authRepo: AuthRepository,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
    private redisTokens: RedisTokens
  ) { }

  async login(loginDto: LoginDto, cookie: any): Promise<any> {
    // if (!cookie) throw new BadRequestException('cookie must be provided');
    const user = await this.authRepo.getUserByEmail(loginDto.email);
    if (!this.bcrypt.isValidPassword(loginDto.password, user.password)) {
      throw new UnauthorizedException('email or user is not correct');
    }
    const { id, email, role } = user;
    const token = await this.jwtService.sign(
      { id, email, role },
      { secret: 'hhhhhhhhhhhhhhhhhh', expiresIn: '1000h' },
      // { secret: process.env.JWT_SECRET, expiresIn: '1000h' },
    );
    // this.redisTokens.storeUserToken(user.id, cookie, token);
    this.redisTokens.storeUserToken(user.id, 'cookie', token);
    delete user.password;
    return { token, user };
  }

  async checkTokenExpiration(token: string, cookie) {
    try {
      if (!cookie) throw new BadRequestException('cookie must be provided');
      const user: any = jwt.verify(token, 'hhhhhhhhhhhhhhhhhh');
      const authentication = await this.authRepo.getUserById(user.id);
      await this.redisTokens.validateUserToken(authentication.id, cookie, token)
      const dateOfToken = moment.unix(user.exp);
      if (
        dateOfToken.isSameOrAfter(moment(Date.now())) == false ||
        !authentication
      ) {
        throw new UnauthorizedException('token expired');
      }
      return authentication;
    } catch (error) {
      throw new UnauthorizedException('token expired');
    }
  }
}
