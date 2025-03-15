// update-podcast.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePodcastDto {
  @ApiPropertyOptional({
    description: 'The ID of the video this podcast is associated with',
    example: 123,
  })
  @IsOptional()
  @IsNumber()
  video_id?: number;

  // @ApiPropertyOptional({
  //     description: 'The ID of the transcript this podcast is associated with',
  //     example: 456
  // })
  // @IsOptional()
  // @IsNumber()
  // transcript_id?: number;

  @ApiPropertyOptional({
    description: 'The AI-generated text for this podcast',
    example: 'Updated AI-generated transcript of the podcast content...',
  })
  @IsOptional()
  @IsString()
  ai_generated_text?: string;
}
