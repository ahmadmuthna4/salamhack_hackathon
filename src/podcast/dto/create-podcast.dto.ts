
// create-podcast.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePodcastDto {
  @ApiProperty({
    description: 'The ID of the video this podcast is associated with',
    example: 123
  })
  @IsNotEmpty()
  @IsNumber()
  video_id: number;

  @ApiProperty({
    description: 'The ID of the transcript this podcast is associated with',
    example: 456
  })
  @IsNotEmpty()
  @IsNumber()
  transcript_id: number;

  @ApiProperty({
    description: 'The AI-generated text for this podcast',
    example: 'This is an AI-generated transcript of the podcast content...'
  })
  @IsNotEmpty()
  @IsString()
  ai_generated_text: string;
}
