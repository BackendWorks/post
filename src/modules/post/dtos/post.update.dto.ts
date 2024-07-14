import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class PostUpdateDto {
  @ApiPropertyOptional({
    description: 'Updated content of the post',
    example: 'Updated post content',
  })
  @IsString({ message: 'Content must be a string' })
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Updated title of the post',
    example: 'Updated post title',
  })
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated array of image URLs',
    type: [String],
    example: [
      'https://example.com/updated-image1.jpg',
      'https://example.com/updated-image2.jpg',
    ],
  })
  @IsArray({ message: 'Images must be an array' })
  @IsString({ each: true, message: 'Each image must be a string' })
  @IsOptional()
  images?: string[];
}
