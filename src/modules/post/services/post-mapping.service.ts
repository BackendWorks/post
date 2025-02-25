import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';

import { PostResponseDto } from '../dtos/post.response.dto';

import { KafkaAuthService } from '@/services/auth/kafka.auth.service';

@Injectable()
export class PostMappingService {
    constructor(private readonly kafkaAuthService: KafkaAuthService) {}

    async enrichPostData(post: Post): Promise<PostResponseDto> {
        const createdBy = post.createdBy
            ? await this.kafkaAuthService.getUserById(post.createdBy)
            : null;
        const updatedBy = post.updatedBy
            ? await this.kafkaAuthService.getUserById(post.updatedBy)
            : null;
        const deletedBy = post.deletedBy
            ? await this.kafkaAuthService.getUserById(post.deletedBy)
            : null;

        return {
            id: post.id,
            title: post.title,
            content: post.content,
            images: post.images,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            deletedAt: post.deletedAt,
            isDeleted: post.isDeleted,
            createdBy: createdBy,
            updatedBy: updatedBy,
            deletedBy: deletedBy,
        };
    }

    async enrichPostsData(posts: Post[]): Promise<PostResponseDto[]> {
        return Promise.all(posts.map((post) => this.enrichPostData(post)));
    }
}
