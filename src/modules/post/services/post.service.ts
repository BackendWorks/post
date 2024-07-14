import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/common/services/prisma.service';

import { PostUpdateDto } from '../dtos/post.update.dto';
import { PostCreateDto } from '../dtos/post.create.dto';
import { PostGetDto } from '../dtos/post.get.dto';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {
    this.authClient.connect();
  }

  public async getOnePost(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!post) {
      throw new HttpException('postNotFound', HttpStatus.NOT_FOUND);
    }
    const createdBy = await firstValueFrom(
      this.authClient.send('getUserById', JSON.stringify({ id: post.author })),
    );
    post.author = createdBy;
    return post;
  }

  public async createNewPost(data: PostCreateDto, userId: number) {
    try {
      const { content, images, title } = data;
      const createPost = await this.prismaService.post.create({
        data: {
          author: userId,
          content: content.trim(),
          title: title.trim(),
          images: {
            create: images.map((item) => {
              return {
                image: item,
              };
            }),
          },
        },
      });
      const createdBy = await firstValueFrom(
        this.authClient.send(
          'getUserById',
          JSON.stringify({
            userId,
          }),
        ),
      );
      createPost.author = createdBy;
      return createPost;
    } catch (e) {
      throw e;
    }
  }

  public async getAllPosts(data: PostGetDto) {
    const { skip, take, search } = data;
    const count = await this.prismaService.post.count({
      where: search && {
        OR: [
          {
            content: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const response = await this.prismaService.post.findMany({
      where: search && {
        OR: [
          {
            content: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      skip,
      take,
    });

    for (const post of response) {
      const createdBy = await firstValueFrom(
        this.authClient.send(
          'getUserById',
          JSON.stringify({ userId: post.author }),
        ),
      );
      post.author = createdBy;
    }

    return {
      count,
      data: response,
    };
  }

  public async updatePost(id: number, data: PostUpdateDto) {
    try {
      const { title, content } = data;
      const findPost = await this.prismaService.post.findUnique({
        where: { id },
      });
      if (!findPost) {
        throw new HttpException('postNotFound', HttpStatus.NOT_FOUND);
      }
      const post = await this.prismaService.post.update({
        where: {
          id,
        },
        data: {
          title: title.trim(),
          content: content.trim(),
        },
      });
      const createdBy = await firstValueFrom(
        this.authClient.send(
          'getUserById',
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
