import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePostDto, UpdatePostDto } from './dtos';
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
      () => this.prismaService.$queryRaw`SELECT 1`,
    ]);
  }

  @Post()
  createPost(@Body() data: CreatePostDto, @CurrentUser() userId: number) {
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
  getPost(@Param() param: { id: string }) {
    return this.appService.getOnePost(Number(param.id));
  }
}
