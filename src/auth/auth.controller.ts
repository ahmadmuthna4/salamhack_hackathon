
import { Body, Controller, Param, Post, Get, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { getToken } from './decorators/get-token.decorator';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post()
  @ApiOperation({ summary: 'Login a user.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  async create(@Body() loginDto: LoginDto, @Req() req: Request) {
    return await this.authService.login(loginDto, req.cookies);
  }

  
  @Get('check')
  @ApiOperation({ summary: 'Check the validity of a token.' })
  @ApiParam({ name: 'token', description: 'The token to check.' })
  @ApiResponse({ status: 200, description: 'Token is valid.' })
  @ApiResponse({ status: 401, description: 'Token is invalid.' })
  checkToken(@getToken() token, @Req() req: Request) {
    return this.authService.checkTokenExpiration(token, req.cookies);
  }
}
