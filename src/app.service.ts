import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Posts } from './database/entities/post.entity';
import { PostRepository } from './database/repository/post.repository';
import { CreatePostDto, GetPostsDto } from './core/dtos';

@Injectable()
export class AppService {
  constructor(
    private postRepository: PostRepository,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {
    this.userClient.connect();
  }

  public async createNewPost(
    data: CreatePostDto,
    authUserId: number,
  ): Promise<Posts> {
    const post = new Posts();
    post.content = data.content;
    post.createdBy = authUserId;
    const create_post = await this.postRepository.save(post);
    const createdBy = await firstValueFrom(
      this.userClient.send('get_user_by_id', {
        userId: create_post.createdBy,
      }),
    );
    create_post.createdBy = createdBy;
    return create_post;
  }

  public async getAllPosts(data: GetPostsDto): Promise<Posts[]> {
    let { limit, page } = data;
    if (!page || page === 0) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const skip = (page - 1) * limit;
    const posts = await this.postRepository.getPosts(skip, limit, data.term);
    return Promise.all(
      posts.map((item) => {
        return firstValueFrom(
          this.userClient.send('get_user_by_id', { userId: item.createdBy }),
        ).then((res) => {
          item.createdBy = res;
          return item;
        });
      }),
    );
  }
}
