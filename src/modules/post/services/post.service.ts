import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Post } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { UpdatePostDto } from '../dtos/update.post.dto';
import { CreatePostDto } from '../dtos/create.post.dto';
import { GetResponse } from '../interfaces/post.interface';
import { PrismaService } from '../../../core/services/prisma.service';
import { IPostService } from '../interfaces/post.service.interface';

@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private prisma: PrismaService,
  ) {
    this.authClient.connect();
  }

  public async getOnePost(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!post) {
      throw new HttpException('postNotFound', HttpStatus.NOT_FOUND);
    }
    const createdBy = await firstValueFrom(
      this.authClient.send(
        'get_user_by_id',
        JSON.stringify({ id: post.author }),
      ),
    );
    post.author = createdBy;
    return post;
  }

  public async createNewPost(
    data: CreatePostDto,
    userId: number,
  ): Promise<Post> {
    try {
      const create_post = await this.prisma.post.create({
        data: {
          title: data?.title?.trim(),
          content: data?.content?.trim(),
          author: userId,
          photos: {
            create: data.photos.map((item) => ({ key: item })),
          },
        },
      });
      const createdBy = await firstValueFrom(
        this.authClient.send(
          'getUserByIdCall',
          JSON.stringify({
            id: userId,
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
      where: data.term && {
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
      where: data.term && {
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
    for (const post of response) {
      const createdBy = await firstValueFrom(
        this.authClient.send(
          'getUserByIdCall',
          JSON.stringify({ id: post.author }),
        ),
      );
      post.author = createdBy;
    }
    return {
      count,
      data: response,
    };
  }

  public async updatePost(id: number, data: UpdatePostDto): Promise<Post> {
    try {
      const findPost = await this.prisma.post.findUnique({ where: { id } });
      if (!findPost) {
        throw new HttpException('postNotFound', HttpStatus.NOT_FOUND);
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
          'getUserByIdCall',
          JSON.stringify({ id: post.author }),
        ),
      );
      post.author = createdBy;
      return post;
    } catch (e) {
      throw e;
    }
  }
}
