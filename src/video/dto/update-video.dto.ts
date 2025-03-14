// update-video.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateVideoDto {
    @ApiPropertyOptional({
        description: 'The YouTube URL of the video',
        example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    })
    @IsOptional()
    @IsUrl()
    youtube_url?: string;

    @ApiPropertyOptional({
        description: 'The title of the video',
        example: 'Introduction to NestJS'
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        description: 'The path to the video thumbnail image',
        example: '/uploads/thumbnails/video-123.jpg'
    })
    @IsOptional()
    @IsString()
    image_path?: string;

    @ApiPropertyOptional({
        description: 'Whether the video has been processed',
        example: true
    })
    @IsOptional()
    @IsBoolean()
    processed?: boolean;
}