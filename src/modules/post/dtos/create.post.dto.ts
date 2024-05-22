import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'content is required' })
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @ApiProperty()
  @IsString()
  @IsArray()
  @IsOptional()
  images: string[];
}
