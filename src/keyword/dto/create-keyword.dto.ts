// create-keyword.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateKeywordDto {
  @ApiProperty({
    description: 'The keyword text',
    example: 'artificial intelligence',
  })
  @IsNotEmpty()
  @IsString()
  keyword: string;

  @ApiPropertyOptional({
    description: 'User level (1: beginner, 2: intermediate, 3: advanced)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  user_level?: number;

  @ApiProperty({
    description: 'The ID of the transcript this keyword belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  // @IsUUID()
  video_id: number;
}
