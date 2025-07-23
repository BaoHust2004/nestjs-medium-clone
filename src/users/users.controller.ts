import { Body, Controller, Get, Param, Put, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
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

@Controller('api/users')  
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')  
  async getCurrentUser(@Req() req: RequestWithUser) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.getCurrentUser(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('me') 
  async updateUser(
    @Body('user') updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.updateUser(req.user.sub, updateUserDto);
  }

  @Get('profiles/:username')  
  async getProfile(@Param('username') username: string) {
    return this.usersService.getProfile(username);
  }
}
