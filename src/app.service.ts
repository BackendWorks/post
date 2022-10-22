import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Post } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { CreatePostDto, GetPostsDto, UpdatePostDto } from './core/dtos';
import { IMailPayload } from './core/interfaces/IMailPayload';
import { PrismaService } from './core/services/prisma.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('MAIL_SERVICE') private readonly mailClient: ClientProxy,
    private prisma: PrismaService,
  ) {
    this.authClient.connect();
    this.mailClient.connect();
  }

  public async createNewPost(
    data: CreatePostDto,
    authUserId: number,
  ): Promise<Post> {
    const post = {} as Post;
    post.content = data.content;
    post.author = authUserId;
    post.title = data.title;
    post.image = String(data.fileId);
    const create_post = await this.prisma.post.create({ data: post });
    const createdBy = await firstValueFrom(
      this.authClient.send('get_user_by_id', {
        userId: create_post.author,
      }),
    );
    create_post.author = createdBy;
    return create_post;
  }

  public async getAllPosts(data: GetPostsDto): Promise<Post[]> {
    let { limit, page } = data;
    if (!page || page === 0) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const skip = (page - 1) * limit;
    const posts = await this.prisma.post.findMany({
      where: {
        content: {
          contains: data.term,
          mode: 'insensitive',
        },
        title: {
          contains: data.term,
          mode: 'insensitive',
        },
      },
      skip: skip,
      take: limit,
    });
    return Promise.all(
      posts.map((item) => {
        return firstValueFrom(
          this.authClient.send('get_user_by_id', { userId: item.author }),
        ).then((res) => {
          item.author = res;
          return item;
        });
      }),
    );
  }

  public async updatePost(id: number, data: UpdatePostDto): Promise<Post> {
    await this.prisma.post.update({
      where: {
        id,
      },
      data: data,
    });
    const updatedPost = await this.prisma.post.findUnique({ where: { id } });
    const createdBy = await firstValueFrom(
      this.authClient.send('get_user_by_id', {
        userId: updatedPost.author,
      }),
    );
    updatedPost.author = createdBy;
    const payload: IMailPayload = {
      template: 'POST_UPDATED',
      payload: {
        emails: [createdBy.email],
        data: {
          firstName: createdBy.firstName,
          lastName: createdBy.lastName,
        },
        subject: 'Post Updated',
      },
    };
    this.mailClient.emit('send_email', payload);
    return updatedPost;
  }
}
