import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  email: string;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticle(
    @Body('article') createArticleDto: CreateArticleDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.articlesService.createArticle(req.user.sub, createArticleDto);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string) {
    return this.articlesService.getArticle(slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard('jwt'))
  async updateArticle(
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.articlesService.updateArticle(slug, req.user.sub, updateArticleDto);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard('jwt'))
  async deleteArticle(
    @Param('slug') slug: string,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.articlesService.deleteArticle(slug, req.user.sub);
  }
}
