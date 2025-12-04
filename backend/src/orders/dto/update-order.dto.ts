import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@nyk/shared';

export class UpdateOrderDto {
    @ApiPropertyOptional({
        enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        example: 'approved',
    })
    @IsEnum(['pending', 'approved', 'rejected', 'completed', 'cancelled'])
    @IsOptional()
    status?: OrderStatus;

    @ApiPropertyOptional({ example: 'Order approved for delivery' })
    @IsString()
    @IsOptional()
    notes?: string;
}
