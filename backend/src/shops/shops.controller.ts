import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Shops')
@Controller('shops')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShopsController {
    constructor(private readonly shopsService: ShopsService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new shop (Admin only)' })
    create(@Body() createShopDto: CreateShopDto) {
        return this.shopsService.create(createShopDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all shops' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'region', required: false })
    findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('region') region?: string,
    ) {
        return this.shopsService.findAll(page, limit, region);
    }

    @Get('regions')
    @ApiOperation({ summary: 'Get all shop regions' })
    getRegions() {
        return this.shopsService.getRegions();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a shop by ID' })
    findOne(@Param('id') id: string) {
        return this.shopsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update a shop (Admin only)' })
    update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
        return this.shopsService.update(id, updateShopDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete a shop (Admin only)' })
    remove(@Param('id') id: string) {
        return this.shopsService.remove(id);
    }
}
