// update-exercise.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateExerciseDto {
  @ApiPropertyOptional({
    description: 'The question text',
    example: 'What is the largest city in France?',
  })
  @IsOptional()
  @IsString()
  question?: string;

  @ApiPropertyOptional({
    description: 'Array of possible answer choices',
    example: ['Paris', 'Lyon', 'Marseille', 'Toulouse'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  answer_choices?: string[];

  @ApiPropertyOptional({
    description: 'The correct answer',
    example: 'Paris',
  })
  @IsOptional()
  @IsString()
  correct_answer?: string;

  @ApiPropertyOptional({
    description: 'The user answer',
    example: 'Paris',
  })
  @IsOptional()
  @IsString()
  user_answer?: string;

  @ApiPropertyOptional({
    description: 'The status of exercise',
    example: 'Paris',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
