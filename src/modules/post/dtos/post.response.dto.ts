import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class PostImagesDto {
  @ApiProperty({
    description: 'Unique identifier of the image',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'URL of the image',
    example: 'https://example.com/image.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Creation date of the image',
    example: '2023-07-14T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update date of the image',
    example: '2023-07-14T00:00:00.000Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Deletion date of the image, if applicable',
    example: '2023-07-14T00:00:00.000Z',
    nullable: true,
  })
  deleted_at?: Date;

  @ApiProperty({
    description: 'Indicates if the image is deleted',
    example: false,
  })
  is_deleted: boolean;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Title of the post',
    example: 'Sample Post Title',
  })
  title: string;

  @ApiProperty({
    description: 'Content of the post',
    example: 'This is a sample post content',
  })
  content: string;

  @ApiProperty({
    description: 'Author ID of the post',
    example: 1,
  })
  author: string;

  @ApiProperty({
    type: [PostImagesDto],
    description: 'Array of image URLs associated with the post',
  })
  @Type(() => PostImagesDto)
  @ValidateNested()
  images: PostImagesDto[];

  @ApiProperty({
    description: 'Creation date of the post',
    example: '2023-07-14T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update date of the post',
    example: '2023-07-14T00:00:00.000Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Deletion date of the post, if applicable',
    example: '2023-07-14T00:00:00.000Z',
    nullable: true,
  })
  deleted_at?: Date;

  @ApiProperty({
    description: 'Indicates if the post is deleted',
    example: false,
  })
  is_deleted: boolean;
}
