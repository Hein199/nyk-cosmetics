import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@nyk/shared';

export class CreateUserDto {
    @ApiProperty({ example: 'john@nyk.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: ['admin', 'salesperson', 'regional_sales'], example: 'salesperson' })
    @IsEnum(['admin', 'salesperson', 'regional_sales'])
    role: UserRole;

    @ApiPropertyOptional({ example: '+959123456789' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: 'Yangon' })
    @IsString()
    @IsOptional()
    region?: string;
}
