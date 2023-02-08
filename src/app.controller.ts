import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { CurrentUser } from './decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createPost(@Body() data: CreatePostDto, @CurrentUser() userId: number) {
    console.log(data);
    return this.appService.createNewPost(data, userId);
  }

  @Get()
  getPosts(@Query() data: { page: number; limit: number; term: string }) {
    const { limit, page, term } = data;
    return this.appService.getAllPosts({
      limit: Number(limit),
      page: Number(page),
      term,
    });
  }

  @Put(':id')
  updatePosts(@Param() param: { id: string }, @Body() data: UpdatePostDto) {
    return this.appService.updatePost(Number(param.id), data);
  }

  @Get(':id')
  getPost(@Param() param: { id: string }, @CurrentUser() userId: number) {
    return this.appService.getOnePost(Number(param.id), userId);
  }
}
