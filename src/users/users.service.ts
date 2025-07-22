import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return { user };
  }

  async updateUser(userId: number, dto: UpdateUserDto) {
    if (dto.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { 
          email: dto.email,
          NOT: { id: userId }
        }
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    if (dto.username) {
      const existingUsername = await this.prisma.user.findFirst({
        where: { 
          username: dto.username,
          NOT: { id: userId }
        }
      });
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    let hashedPassword;
    if (dto.password) {
      hashedPassword = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        image: true,
      }
    });

    return { user };
  }

  async getProfile(username: string) {
    const profile = await this.prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        bio: true,
        image: true,
      }
    });

    if (!profile) {
      throw new ForbiddenException('Profile not found');
    }

    return {
      profile: {
        ...profile,
        following: false // TODO: Implement following functionality
      }
    };
  }
}