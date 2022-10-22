import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No content provided' })
  public content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No title provided' })
  public title: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'No title provided' })
  public fileId: number;
}
