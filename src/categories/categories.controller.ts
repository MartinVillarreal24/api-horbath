import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Categorías')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @ApiOperation({
        summary: 'Crear una categoría',
        description: 'Crea una nueva categoría. El nombre debe ser único en el sistema.'
    })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        console.log('--- DATOS RECIBIDOS ---');
        console.log(createCategoryDto); // <--- Agrega esto
        console.log('-----------------------');
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Listar todas las categorías',
        description: 'Devuelve la lista completa de categorías incluyendo el conteo de productos asociados a cada una.'
    })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener categoría por ID',
        description: 'Busca una categoría específica. Retorna 404 si no existe.'
    })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Actualizar categoría',
        description: 'Actualiza los datos de una categoría existente.'
    })
    @UseGuards(AuthGuard())
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Eliminar categoría',
        description: 'Elimina una categoría por su ID. Falla si la categoría tiene productos asociados.'
    })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.remove(id);
    }
}