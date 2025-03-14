// create-video.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
    @ApiProperty({
        description: 'The YouTube URL of the video',
        example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    })
    @IsNotEmpty()
    @IsUrl()
    youtube_url: string;

    @ApiProperty({
        description: 'The title of the video',
        example: 'Introduction to NestJS'
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: 'The path to the video thumbnail image',
        example: '/uploads/thumbnails/video-123.jpg'
    })
    @IsOptional()
    @IsString()
    image_path?: string;

    @ApiPropertyOptional({
        description: 'Whether the video has been processed',
        example: false
    })
    @IsOptional()
    @IsBoolean()
    processed?: boolean;

    @ApiProperty({
        description: 'The ID of the user who owns the video',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}
