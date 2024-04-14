import { Post } from '@prisma/client';
import { CreatePostDto } from '../dtos/create.post.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';
import { GetResponse } from './post.interface';

export interface IPostService {
  getOnePost(id: number): Promise<Post>;
  createNewPost(data: CreatePostDto, userId: number): Promise<Post>;
  getAllPosts(data: {
    page: number;
    limit: number;
    term: string;
  }): Promise<GetResponse<Post>>;
  updatePost(id: number, data: UpdatePostDto): Promise<Post>;
}
