import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Post } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { PrismaService } from './services';
import { GetResponse } from './types';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private prisma: PrismaService,
  ) {
    this.authClient.connect();
  }

  public async getOnePost(id) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  public async createNewPost(
    data: CreatePostDto,
    userId: number,
  ): Promise<Post> {
    try {
      const post = {} as Post;
      post.content = data.content;
      post.author = userId;
      post.title = data.title;
      post.image = data.fileId;
      const create_post = await this.prisma.post.create({ data: post });
      const createdBy = await firstValueFrom(
        this.authClient.send(
          'get_user_by_userid',
          JSON.stringify({
            userId,
          }),
        ),
      );
      create_post.author = createdBy;
      return create_post;
    } catch (e) {
      throw e;
    }
  }

  public async getAllPosts(data: {
    page: number;
    limit: number;
    term: string;
  }): Promise<GetResponse<Post>> {
    let { limit, page } = data;
    if (!page || page === 0) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const skip = (page - 1) * limit;
    const count = await this.prisma.post.count({
      where: {
        OR: [
          {
            content: {
              contains: data.term,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: data.term,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    const response = await this.prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              contains: data.term,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: data.term,
              mode: 'insensitive',
            },
          },
        ],
      },
      skip,
      take: limit,
    });
    return {
      count,
      data: response,
    };
  }

  public async updatePost(id: number, data: UpdatePostDto): Promise<Post> {
    try {
      const findPost = await this.prisma.post.findUnique({ where: { id } });
      if (!findPost) {
        throw new HttpException('post_not_found', HttpStatus.NOT_FOUND);
      }
      const post = await this.prisma.post.update({
        where: {
          id,
        },
        data: {
          title: data.title,
          content: data.content,
        },
      });
      const createdBy = await firstValueFrom(
        this.authClient.send(
          'get_user_by_userid',
          JSON.stringify({ userId: post.author }),
        ),
      );
      post.author = createdBy;
      return post;
    } catch (e) {
      throw e;
    }
  }
}
