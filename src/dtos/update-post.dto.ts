import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  public content: string;

  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsString()
  public fileId: string;
}
