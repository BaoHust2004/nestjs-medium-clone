import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/auth.dto';
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  email: string;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('users') 
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('users/login') 
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

}
