import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'content not provided' })
  public content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'title not provided' })
  public title: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'title not provided' })
  public fileId: number;
}
