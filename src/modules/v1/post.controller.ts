import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import {
  CreatePostDto,
  CurrentUser,
  GetAllPostsDto,
  UpdatePostDto,
} from 'src/core';

@Controller('v1')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() data: CreatePostDto, @CurrentUser() user) {
    return this.postService.createNewPost(data, user.id);
  }

  @Get()
  getPosts(@Query() data: GetAllPostsDto) {
    const { limit, page, search } = data;
    return this.postService.getAllPosts({
      limit: Number(limit),
      page: Number(page),
      term: search,
    });
  }

  @Put(':id')
  updatePosts(@Param('id') id: number, @Body() data: UpdatePostDto) {
    return this.postService.updatePost(id, data);
  }

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postService.getOnePost(id);
  }
}
