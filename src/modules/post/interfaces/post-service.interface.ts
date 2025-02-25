import { PostCreateDto } from '../dtos/post-create.dto';
import { PostListDto } from '../dtos/post-list.dto';
import { PostResponseDto } from '../dtos/post.response.dto';
import { PostUpdateDto } from '../dtos/post.update.dto';
import { PostBulkResponseDto } from '../dtos/post-bulk-response.dto';

import { PaginatedData } from '@/common/dtos/paginated-response.dto';

export interface IPostService {
    createPost(
        createPostDto: PostCreateDto,
        userId: string,
    ): Promise<PostResponseDto>;

    getPosts(query: PostListDto): Promise<PaginatedData<PostResponseDto>>;

    updatePost(
        userId: string,
        id: string,
        updatePostDto: PostUpdateDto,
    ): Promise<PostResponseDto>;

    softDeletePosts(
        userId: string,
        postIds: string[],
    ): Promise<PostBulkResponseDto>;
}
