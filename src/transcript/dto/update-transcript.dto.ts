
// update-transcript.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTranscriptDto {
    @ApiPropertyOptional({
        description: 'The transcript text',
        example: 'Updated transcript text of the video.'
    })
    @IsOptional()
    @IsString()
    text?: string;

    @ApiPropertyOptional({
        description: 'The start timestamp of the transcript segment',
        example: 11.2
    })
    @IsOptional()
    @IsNumber()
    timestamp_start?: number;

    @ApiPropertyOptional({
        description: 'The end timestamp of the transcript segment',
        example: 16.5
    })
    @IsOptional()
    @IsNumber()
    timestamp_end?: number;

    @ApiPropertyOptional({
        description: 'The sequence  transcript',
        example: 1
    })
    @IsOptional()
    @IsNumber()
    sequence?: number;


    @ApiPropertyOptional({
        description: 'The duration  of the transcript segment',
        example: 5.3
    })
    @IsOptional()
    @IsNumber()
    duration?: number;
}