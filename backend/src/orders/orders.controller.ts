import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrderStatus } from '@nyk/shared';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    create(
        @Body() createOrderDto: CreateOrderDto,
        @Request() req: { user: { userId: string } },
    ) {
        return this.ordersService.create(req.user.userId, createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all orders' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'shopId', required: false })
    @ApiQuery({ name: 'salespersonId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('status') status?: OrderStatus,
        @Query('shopId') shopId?: string,
        @Query('salespersonId') salespersonId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.ordersService.findAll(page, limit, status, shopId, salespersonId, startDate, endDate);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    getStats() {
        return this.ordersService.getStats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an order by ID' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'regional_sales')
    @ApiOperation({ summary: 'Update order status (Admin/Regional Sales only)' })
    updateStatus(
        @Param('id') id: string,
        @Body() updateOrderDto: UpdateOrderDto,
        @Request() req: { user: { userId: string } },
    ) {
        return this.ordersService.updateStatus(id, updateOrderDto, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete an order (Admin only)' })
    remove(@Param('id') id: string) {
        return this.ordersService.remove(id);
    }
}
