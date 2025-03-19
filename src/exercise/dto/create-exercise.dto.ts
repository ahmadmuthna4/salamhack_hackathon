// create-exercise.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExerciseDto {
  @ApiProperty({
    description: 'The question text',
    example: 'What is the capital of France?',
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Array of possible answer choices',
    example: ['Paris', 'London', 'Berlin', 'Madrid'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  answer_choices: string[];

  @ApiProperty({
    description: 'The correct answer',
    example: 'Paris',
  })
  @IsNotEmpty()
  @IsString()
  correct_answer: string;

  @ApiPropertyOptional({
    description: 'The user answer',
    example: 'Paris',
  })
  @IsOptional()
  @IsString()
  user_answer?: string;

  @ApiProperty({
    description: 'The ID of the podcast this exercise belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  podcast_id: number;

  @ApiPropertyOptional({
    description: 'The status of exercise',
    example: 'Paris',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
