import { Post } from '@prisma/client';

import { PostUpdateDto } from '../dtos/post.update.dto';
import { PostCreateDto } from '../dtos/post.create.dto';
import { GetResponse } from '../interfaces/posts.interface';

export interface IPostService {
  getOnePost(id: number): Promise<Post>;
  createNewPost(data: PostCreateDto, userId: number): Promise<Post>;
  getAllPosts(data: {
    page: number;
    limit: number;
    term: string;
  }): Promise<GetResponse<Post>>;
  updatePost(id: number, data: PostUpdateDto): Promise<Post>;
}
