import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'NYK Face Cream' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'NYK-FC-001' })
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 15000 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: 'box' })
    @IsString()
    @IsNotEmpty()
    unit: string;

    @ApiPropertyOptional({ example: 'Premium face cream with natural ingredients' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @ApiPropertyOptional({ example: 'Skincare' })
    @IsString()
    @IsOptional()
    category?: string;
}
