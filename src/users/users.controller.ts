import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/user.dto';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  email: string;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async getCurrentUser(@Req() req: RequestWithUser) {
    if (!req.user) {
      throw new Error('No user from auth guard');
    }
    return this.usersService.getCurrentUser(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('user')
  async updateUser(
    @Body('user') dto: UpdateUserDto,
    @Req() req: RequestWithUser
  ) {
    if (!req.user) {
      throw new Error('No user from auth guard');
    }
    return this.usersService.updateUser(req.user.sub, dto);
  }

  @Get('profiles/:username')
  async getProfile(@Param('username') username: string) {
    return this.usersService.getProfile(username);
  }
}