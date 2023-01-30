import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePostDto, UpdatePostDto } from './core/dtos';
import { CurrentUser } from './core/decorators';
import { JwtAuthGuard, RolesGuard } from './core/guards';

@Controller()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
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
