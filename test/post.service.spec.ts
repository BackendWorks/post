import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { Post } from '@prisma/client';
import { PostCreateDto } from 'src/modules/post/dtos/post.create.dto';
import { PostUpdateDto } from 'src/modules/post/dtos/post.update.dto';
import { PostGetDto } from 'src/modules/post/dtos/post.get.dto';

import { PrismaService } from '../src/common/services/prisma.service';
import { PostService } from '../src/modules/post/services/post.service';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;
  let authClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              findUnique: jest.fn(),
              create: jest.fn(),
              count: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: 'AUTH_SERVICE',
          useValue: {
            send: jest.fn(),
            connect: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
    authClient = module.get<ClientProxy>('AUTH_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOnePost', () => {
    it('should return a post with author details', async () => {
      const post = {
        id: 1,
        author: '7166a277-7d6c-4b67-9f3f-a25fc2e6649c',
      } as Post;
      const user = { id: 1, username: 'testuser' };

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(post);
      jest.spyOn(authClient, 'send').mockReturnValue(of(user));

      const result = await service.getOnePost(1);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(authClient.send).toHaveBeenCalledWith(
        'getUserById',
        JSON.stringify({ id: 1 }),
      );
      expect(result).toEqual({ ...post, author: user });
    });

    it('should throw an error if post not found', async () => {
      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

      await expect(service.getOnePost(1)).rejects.toThrow(
        new HttpException('postNotFound', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('createNewPost', () => {
    it('should create a new post', async () => {
      const data: PostCreateDto = {
        content: 'Test content',
        images: ['image1.jpg'],
        title: 'Test title',
      };
      const userId = '7166a277-7d6c-4b67-9f3f-a25fc2e6649c';
      const createdPost = { id: 1, author: userId, ...data } as unknown as Post;
      const user = { id: userId, username: 'testuser' };

      jest.spyOn(prismaService.post, 'create').mockResolvedValue(createdPost);
      jest.spyOn(authClient, 'send').mockReturnValue(of(user));

      const result = await service.createNewPost(data, userId);

      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: {
          author: userId,
          content: data.content.trim(),
          title: data.title.trim(),
          images: {
            create: data.images.map((item) => ({ image: item })),
          },
        },
      });
      expect(authClient.send).toHaveBeenCalledWith(
        'getUserById',
        JSON.stringify({ userId }),
      );
      expect(result).toEqual({ ...createdPost, author: user });
    });

    it('should throw an error if creation fails', async () => {
      const data: PostCreateDto = {
        content: 'Test content',
        images: ['image1.jpg'],
        title: 'Test title',
      };
      const userId = '7166a277-7d6c-4b67-9f3f-a25fc2e6649c';
      const error = new Error('Database error');

      jest.spyOn(prismaService.post, 'create').mockRejectedValue(error);

      await expect(service.createNewPost(data, userId)).rejects.toThrow(error);
    });
  });

  describe('getAllPosts', () => {
    it('should return paginated posts with author details', async () => {
      const data: PostGetDto = { skip: 0, take: 10, search: 'Test' };
      const posts = [
        {
          id: 1,
          author: '7166a277-7d6c-4b67-9f3f-a25fc2e6649c',
          content: 'Test content',
          title: 'Test title',
        },
      ] as Post[];
      const count = 1;
      const user = { id: 1, username: 'testuser' };

      jest.spyOn(prismaService.post, 'count').mockResolvedValue(count);
      jest.spyOn(prismaService.post, 'findMany').mockResolvedValue(posts);
      jest.spyOn(authClient, 'send').mockReturnValue(of(user));

      const result = await service.getAllPosts(data);

      expect(prismaService.post.count).toHaveBeenCalledWith({
        where: {
          OR: [
            { content: { contains: data.search, mode: 'insensitive' } },
            { title: { contains: data.search, mode: 'insensitive' } },
          ],
        },
      });
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { content: { contains: data.search, mode: 'insensitive' } },
            { title: { contains: data.search, mode: 'insensitive' } },
          ],
        },
        skip: data.skip,
        take: data.take,
      });

      expect(result).toEqual({
        count,
        data: posts.map((post) => ({ ...post, author: user })),
      });
    });

    it('should return empty array if no posts found', async () => {
      const data: PostGetDto = { skip: 0, take: 10, search: 'Test' };
      const posts = [] as Post[];
      const count = 0;

      jest.spyOn(prismaService.post, 'count').mockResolvedValue(count);
      jest.spyOn(prismaService.post, 'findMany').mockResolvedValue(posts);

      const result = await service.getAllPosts(data);

      expect(prismaService.post.count).toHaveBeenCalledWith({
        where: {
          OR: [
            { content: { contains: data.search, mode: 'insensitive' } },
            { title: { contains: data.search, mode: 'insensitive' } },
          ],
        },
      });
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { content: { contains: data.search, mode: 'insensitive' } },
            { title: { contains: data.search, mode: 'insensitive' } },
          ],
        },
        skip: data.skip,
        take: data.take,
      });

      expect(result).toEqual({
        count,
        data: posts,
      });
    });

    it('should return posts without search term', async () => {
      const data: PostGetDto = { skip: 0, take: 10, search: '' };
      const posts = [
        {
          id: 1,
          author: '7166a277-7d6c-4b67-9f3f-a25fc2e6649c',
          content: 'Test content',
          title: 'Test title',
        },
      ] as Post[];
      const count = 1;
      const user = { id: 1, username: 'testuser' };

      jest.spyOn(prismaService.post, 'count').mockResolvedValue(count);
      jest.spyOn(prismaService.post, 'findMany').mockResolvedValue(posts);
      jest.spyOn(authClient, 'send').mockReturnValue(of(user));

      const result = await service.getAllPosts(data);

      expect(prismaService.post.count).toHaveBeenCalledWith({ where: '' });
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        where: '',
        skip: data.skip,
        take: data.take,
      });

      expect(result).toEqual({
        count,
        data: posts.map((post) => ({ ...post, author: user })),
      });
    });

    it('should handle errors gracefully', async () => {
      const data: PostGetDto = { skip: 0, take: 10, search: 'Test' };
      const error = new Error('Database error');

      jest.spyOn(prismaService.post, 'count').mockRejectedValue(error);

      await expect(service.getAllPosts(data)).rejects.toThrow(error);
    });
  });

  describe('updatePost', () => {
    it('should update an existing post', async () => {
      const id = 1;
      const data = {
        title: 'Updated title',
        content: 'Updated content',
      } as PostUpdateDto;
      const post = { id, author: 1, ...data } as unknown as Post;
      const user = { id: 1, username: 'testuser' };

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(post);
      jest.spyOn(prismaService.post, 'update').mockResolvedValue(post);
      jest.spyOn(authClient, 'send').mockReturnValue(of(user));

      const result = await service.updatePost(id, data);

      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          title: data.title.trim(),
          content: data.content.trim(),
        },
      });
      expect(authClient.send).toHaveBeenCalledWith(
        'getUserById',
        JSON.stringify({ userId: 1 }),
      );
      expect(result).toEqual({ ...post, author: user });
    });

    it('should throw an error if post not found', async () => {
      const id = 1;
      const data = {
        title: 'Updated title',
        content: 'Updated content',
      } as PostUpdateDto;

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue(null);

      await expect(service.updatePost(id, data)).rejects.toThrow(
        new HttpException('postNotFound', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if update fails', async () => {
      const id = 1;
      const data = {
        title: 'Updated title',
        content: 'Updated content',
      } as PostUpdateDto;
      const error = new Error('Database error');

      jest.spyOn(prismaService.post, 'findUnique').mockResolvedValue({
        id,
        author: '7166a277-7d6c-4b67-9f3f-a25fc2e6649c',
      } as Post);
      jest.spyOn(prismaService.post, 'update').mockRejectedValue(error);

      await expect(service.updatePost(id, data)).rejects.toThrow(error);
    });
  });
});
