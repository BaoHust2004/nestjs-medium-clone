import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('users') // Đăng ký
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('users/login') // Đăng nhập
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  getCurrentUser(@Req() req: Request) {
    return req.user;
  }
}
