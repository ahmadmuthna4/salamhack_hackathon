// create-audio-file.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAudioFileDto {
  @ApiProperty({
    description: 'The path to the audio file',
    example: '/uploads/podcasts/audio-123.mp3',
  })
  @IsNotEmpty()
  @IsString()
  file_path: string;

  @ApiProperty({
    description: 'The ID of the podcast this audio file belongs to',
    example: '34',
  })
  @IsNotEmpty()
  podcast_id: number;
}
