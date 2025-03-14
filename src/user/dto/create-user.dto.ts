import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum UserRoleEnum {
    ADMIN = 'admin',
    USER = 'user',
}


export class CreateUserDto {
    
    @ApiProperty({ 
        description: 'The name of the user.',
         example: 'Ahmed' 
        })
    @IsString()
    @IsNotEmpty()
    name: string;

  
    @ApiProperty({ 
        description: 'The email of the user.', 
        example: 'Ahmed@example.com' 
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    
    @ApiProperty({ 
        description: 'The password of the user.',
         example: 'password123'
         })
    @IsNotEmpty()
    @IsString()
    password: string;

    /**
     * The role of the user.
     */
    @ApiPropertyOptional({ 
        description: 'The role of the user.',
         enum: UserRoleEnum ,
         example: 'admin',
        })
    @IsOptional()
    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}

