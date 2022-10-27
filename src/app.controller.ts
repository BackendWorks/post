import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { CreatePostDto, GetPostsDto, UpdatePostDto } from './core/dtos';
import { CurrentUser } from './core/user.decorator';
import { AllowUnauthorizedRequest } from './core/allow.unauthorized.decorator';
import { PrismaService } from './core/services/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @AllowUnauthorizedRequest()
  @Get('/health')
  public healthCheck(@Res() res: Response) {
    this.prisma
      .$connect()
      .then(() => {
        return res.status(HttpStatus.OK).json({ stauts: 'ok' });
      })
      .catch((e) => {
        return res.status(HttpStatus.OK).json({ stauts: 'down', error: e });
      });
  }

  @Post('/create')
  createPost(@Body() data: CreatePostDto, @CurrentUser() authUserId: number) {
    return this.appService.createNewPost(data, authUserId);
  }

  @Get('/')
  getPosts(@Query() data: GetPostsDto) {
    return this.appService.getAllPosts(data);
  }

  @Put('/update/:id')
  updatePosts(@Param() id: number, @Body() data: UpdatePostDto) {
    return this.appService.updatePost(id, data);
  }
}
