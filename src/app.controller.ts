import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { CurrentUser } from './decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/create')
  createPost(@Body() data: CreatePostDto, @CurrentUser() authUserId: number) {
    return this.appService.createNewPost(data, authUserId);
  }

  @Get('/')
  getPosts(@Query() data: { page: number; limit: number; term: string }) {
    const { limit, page, term } = data;
    return this.appService.getAllPosts({
      limit: Number(limit),
      page: Number(page),
      term,
    });
  }

  @Put('/update/:id')
  updatePosts(@Param() id: number, @Body() data: UpdatePostDto) {
    return this.appService.updatePost(id, data);
  }
}
