import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShopDto {
    @ApiProperty({ example: 'Beauty Corner' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '123 Main Street, Yangon' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: '+959123456789' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiPropertyOptional({ example: 'Yangon' })
    @IsString()
    @IsOptional()
    region?: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsString()
    @IsOptional()
    contactPerson?: string;

    @ApiPropertyOptional({ example: 'shop@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;
}
