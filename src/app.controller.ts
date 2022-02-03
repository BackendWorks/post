import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePostDto, GetPostsDto } from './core/dtos';
import { CurrentUser } from './core/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/create')
  createPost(@Body() data: CreatePostDto, @CurrentUser() authUserId: number) {
    return this.appService.createNewPost(data, authUserId);
  }

  @Get('/')
  getPosts(@Query() data: GetPostsDto) {
    return this.appService.getAllPosts(data);
  }
}
