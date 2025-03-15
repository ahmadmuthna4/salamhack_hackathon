// create-transcript.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTranscriptDto {
    @ApiProperty({
        description: 'The transcript text',
        example: 'This is the transcript text of the video.'
    })
    @IsNotEmpty()
    @IsString()
    text: string;

    @ApiProperty({
        description: 'The start timestamp of the transcript segment',
        example: 10.5
    })
    @IsOptional()
    @IsNumber()
    timestamp_start?: number;

    @ApiProperty({
        description: 'The sequence  transcript',
        example: 1
    })
    @IsOptional()
    @IsNumber()
    sequence?: number;


    @ApiProperty({
        description: 'The duration  of the transcript segment',
        example: 5.3
    })
    @IsOptional()
    @IsNumber()
    duration?: number;

    @ApiProperty({
        description: 'The end timestamp of the transcript segment',
        example: 15.7
    })
    @IsOptional()
    @IsNumber()
    timestamp_end?: number;

    @ApiProperty({
        description: 'The ID of the video this transcript belongs to',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    video_id: number;
}
