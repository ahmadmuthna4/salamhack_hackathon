import { ApiProperty } from '@nestjs/swagger';
import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
   
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        example: 'Ahmed@gmail.com'
    })
    @Type(() => String)
    email: string;

   
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        example: 'password123'
    })
    @Type(() => String)
    password: string;
}

