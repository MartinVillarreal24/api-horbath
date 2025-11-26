import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Crear nuevo producto',
        description: 'Crea un producto validando que la categoría exista, el precio sea positivo y el stock no sea negativo.'
    })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Listar productos (Paginado)',
        description: 'Obtiene productos con opciones de paginación, filtro por categoría y búsqueda insensible a mayúsculas.'
    })
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('categoryId') categoryId?: string,
        @Query('search') search?: string,
    ) {
        const catId = categoryId ? parseInt(categoryId) : undefined;
        return this.productsService.findAll(page, limit, catId, search);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener producto por ID',
        description: 'Devuelve el detalle de un producto incluyendo su categoría relacionada.'
    })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @ApiOperation({
        summary: 'Actualizar producto',
        description: 'Modifica datos de un producto. Si se cambia la categoría, valida que la nueva exista.'
    })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @ApiOperation({
        summary: 'Eliminar producto',
        description: 'Elimina permanentemente un producto del sistema.'
    })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }
}