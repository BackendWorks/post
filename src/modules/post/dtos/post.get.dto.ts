import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class PostGetDto {
  @ApiProperty({
    description: 'Take number for pagination',
    example: 1,
  })
  @IsNotEmpty({ message: 'Take is required' })
  @IsInt({ message: 'Take must be an integer' })
  @Min(1, { message: 'Take must be at least 1' })
  take: number;

  @ApiProperty({
    description: 'Skip of items per page',
    example: 10,
  })
  @IsNotEmpty({ message: 'Skip is required' })
  @IsInt({ message: 'Skip must be an integer' })
  skip: number;

  @ApiPropertyOptional({
    description: 'Search term to filter the posts',
    example: 'nestjs',
  })
  @IsOptional()
  search?: string;
}
