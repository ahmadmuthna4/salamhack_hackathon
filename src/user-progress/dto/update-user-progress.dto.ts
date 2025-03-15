
// update-user-progress.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateUserProgressDto {
    @ApiPropertyOptional({
        description: 'The XP points of the user',
        example: 100
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    xp_points?: number;

    @ApiPropertyOptional({
        description: 'The level of the user',
        example: 2
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    level?: number;
}
