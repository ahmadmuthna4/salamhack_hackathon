
// create-user-progress.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateUserProgressDto {
    @ApiProperty({
        description: 'The ID of the user this progress belongs to',
        example: 123
    })
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @ApiPropertyOptional({
        description: 'The XP points of the user',
        example: 0,
        default: 0
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    xp_points?: number;

    @ApiPropertyOptional({
        description: 'The level of the user',
        example: 1,
        default: 1
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    level?: number;
}