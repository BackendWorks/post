import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Role } from './config/constants';
import { CreatePostDto, GetPostsDto, UpdatePostDto } from './core/dtos';
import { Roles } from './core/roles.decorator';
import { CurrentUser } from './core/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/create')
  @Roles([Role.ADMIN])
  createPost(@Body() data: CreatePostDto, @CurrentUser() authUserId: number) {
    return this.appService.createNewPost(data, authUserId);
  }

  @Get('/')
  @Roles([Role.ADMIN, Role.USER])
  getPosts(@Query() data: GetPostsDto) {
    return this.appService.getAllPosts(data);
  }

  @Put('/:id/update')
  @Roles([Role.ADMIN])
  updatePosts(@Param() id: number, @Body() data: UpdatePostDto) {
    return this.appService.updatePost(id, data);
  }
}
