import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetAllPostsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'page is required' })
  page: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'limit is required' })
  limit: number;

  @ApiProperty()
  @IsOptional()
  search: string;
}
