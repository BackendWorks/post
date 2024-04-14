import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsArray()
  public photos?: string[];
}
