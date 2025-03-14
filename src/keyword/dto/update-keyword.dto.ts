
// update-keyword.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateKeywordDto {
    @ApiPropertyOptional({
        description: 'The keyword text',
        example: 'machine learning'
    })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional({
        description: 'User level (1: beginner, 2: intermediate, 3: advanced)',
        example: 2
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(3)
    user_level?: number;
}
