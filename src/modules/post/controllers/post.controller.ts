import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dtos/create.post.dto';
import { AuthUser } from '../../../core/decorators/auth.user.decorator';
import { GetAllPostsDto } from '../dtos/get.post.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';

@Controller({
  version: '1',
  path: '/post',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() data: CreatePostDto, @AuthUser() user) {
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
