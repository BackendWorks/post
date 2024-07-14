import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostService } from '../services/post.service';
import { PostCreateDto } from '../dtos/post.create.dto';
import { AuthUser } from '../../../decorators/auth.decorator';
import { PostGetDto } from '../dtos/post.get.dto';
import { PostUpdateDto } from '../dtos/post.update.dto';

@ApiTags('post')
@Controller({
  version: '1',
  path: '/post',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() data: PostCreateDto, @AuthUser() user) {
    return this.postService.createNewPost(data, user.id);
  }

  @Get()
  getPosts(@Query() data: PostGetDto) {
    const { limit, page, search } = data;
    return this.postService.getAllPosts({
      limit: Number(limit),
      page: Number(page),
      term: search,
    });
  }

  @Put(':id')
  updatePosts(@Param('id') id: number, @Body() data: PostUpdateDto) {
    return this.postService.updatePost(id, data);
  }

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postService.getOnePost(id);
  }
}
