// create-video.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({
    description: 'The YouTube URL of the video',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsNotEmpty()
  @IsUrl()
  youtube_url: string;

  @ApiProperty({
    description: 'The title of the video',
    example: 'Introduction to NestJS',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The path to the video thumbnail image',
    example: '/uploads/thumbnails/video-123.jpg',
  })
  @IsOptional()
  @IsString()
  image_path?: string;

  @ApiPropertyOptional({
    description: 'Whether the video has been processed',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  processed?: boolean;

  @ApiProperty({
    description: 'The ID of the user who owns the video',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}

export class CreateTranscriptDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsNumber()
  timestamp_start?: number;

  @IsOptional()
  @IsNumber()
  timestamp_end?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  sequence?: number;
}

export class CreateKeywordDto {
  @IsNotEmpty()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsNumber()
  user_level?: number;

  @IsNotEmpty()
  @IsNumber()
  transcript_index: number; // Index in the transcripts array to associate with
}

export class CreateVideoWithRelatedDto {
  //   @ValidateNested()
  //   @Type(() => CreateVideoDto)
  //   video: CreateVideoDto;

  //   @IsArray()
  //   @ValidateNested({ each: true })
  //   @Type(() => CreateTranscriptDto)
  //   transcripts: CreateTranscriptDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKeywordDto)
  keywords: CreateKeywordDto[];

  @IsOptional()
  @IsString()
  url?: string;
}
