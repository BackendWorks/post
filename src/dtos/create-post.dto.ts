import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'content is required' })
  public content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  public title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'fileId is required' })
  public fileId: string;
}
