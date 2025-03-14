
// update-audio-file.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAudioFileDto {
    @ApiPropertyOptional({
        description: 'The path to the audio file',
        example: '/uploads/podcasts/audio-123-updated.mp3'
    })
    @IsOptional()
    @IsString()
    file_path?: string;
}
