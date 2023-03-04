import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePostDto, GetAllPostsDto, UpdatePostDto } from './dtos';
import { CurrentUser, Public } from './decorators';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from './services';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private healthCheckService: HealthCheckService,
    private prismaService: PrismaService,
  ) {}

  @Get('/health')
  @HealthCheck()
  @Public()
  public async getHealth() {
    return this.healthCheckService.check([
      () => this.prismaService.isHealthy(),
    ]);
  }

  @Post()
  createPost(@Body() data: CreatePostDto, @CurrentUser() user) {
    return this.appService.createNewPost(data, user.id);
  }

  @Get()
  getPosts(@Query() data: GetAllPostsDto) {
    const { limit, page, search } = data;
    return this.appService.getAllPosts({
      limit: Number(limit),
      page: Number(page),
      term: search,
    });
  }

  @Put(':id')
  updatePosts(@Param('id') id: number, @Body() data: UpdatePostDto) {
    return this.appService.updatePost(id, data);
  }

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.appService.getOnePost(id);
  }
}
