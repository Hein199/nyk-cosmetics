import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
    @ApiProperty({ example: 'clxyz123...' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 5 })
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ example: 'clxyz456...' })
    @IsString()
    @IsNotEmpty()
    shopId: string;

    @ApiProperty({
        type: [CreateOrderItemDto],
        example: [{ productId: 'clxyz123...', quantity: 5 }],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @ApiPropertyOptional({ example: 'Urgent delivery needed' })
    @IsString()
    @IsOptional()
    notes?: string;
}
