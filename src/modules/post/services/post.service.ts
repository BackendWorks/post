import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PostCreateDto } from '../dtos/post-create.dto';
import { PostListDto } from '../dtos/post-list.dto';
import { PostResponseDto } from '../dtos/post.response.dto';
import { PostUpdateDto } from '../dtos/post.update.dto';
import { PostBulkResponseDto } from '../dtos/post-bulk-response.dto';
import { IPostService } from '../interfaces/post-service.interface';
import { PostMappingService } from './post-mapping.service';

import { DatabaseService } from '@/database/database.service';
import { PaginatedData } from '@/common/dtos/paginated-response.dto';

@Injectable()
export class PostService implements IPostService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly postMappingService: PostMappingService,
    ) {}

    async createPost(
        createPostDto: PostCreateDto,
        userId: string,
    ): Promise<PostResponseDto> {
        const post = await this.databaseService.post.create({
            data: {
                title: createPostDto.title,
                content: createPostDto.content,
                images: createPostDto.images ?? [],
                createdBy: userId,
            },
        });

        return this.postMappingService.enrichPostData(post);
    }

    async getPosts(
        query: PostListDto,
    ): Promise<PaginatedData<PostResponseDto>> {
        const { authorId, search, page = 1, limit = 10 } = query;

        const skip = (page - 1) * limit;
        const take = limit;

        const where: Prisma.PostWhereInput = {
            isDeleted: false,
            ...(authorId && { createdBy: authorId }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [count, data] = await Promise.all([
            this.databaseService.post.count({ where }),
            this.databaseService.post.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        return {
            data: await this.postMappingService.enrichPostsData(data),
            total: count,
            page,
            limit: take,
        };
    }

    async updatePost(
        userId: string,
        id: string,
        updatePostDto: PostUpdateDto,
    ): Promise<PostResponseDto> {
        const updatedPost = await this.databaseService.post.update({
            where: { id },
            data: { ...updatePostDto, updatedBy: userId },
        });

        return this.postMappingService.enrichPostData(updatedPost);
    }

    async softDeletePosts(
        userId: string,
        postIds: string[],
    ): Promise<PostBulkResponseDto> {
        const result = await this.databaseService.post.updateMany({
            where: {
                id: {
                    in: postIds,
                },
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId,
            },
        });

        return {
            count: result.count,
        };
    }
}
