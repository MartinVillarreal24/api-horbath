import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../products/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const existing = await this.categoryRepository.findOneBy({ nombre: createCategoryDto.nombre });
        if (existing) throw new ConflictException('Ya existe una categoría con ese nombre');

        const category = this.categoryRepository.create(createCategoryDto);
        return await this.categoryRepository.save(category);
    }

    async findAll() {
        return await this.categoryRepository.find({
            relations: { productos: true },
            select: {
                productos: { id: true }
            }
        }).then(categories => categories.map(cat => ({
            ...cat,
            totalProductos: cat.productos.length,
            productos: undefined
        })));
    }

    async findOne(id: number) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: { productos: true }
        });
        if (!category) throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.findOne(id);

        if (updateCategoryDto.nombre && updateCategoryDto.nombre !== category.nombre) {
            const existing = await this.categoryRepository.findOneBy({ nombre: updateCategoryDto.nombre });
            if (existing) throw new ConflictException('Ya existe una categoría con ese nombre');
        }

        const updated = this.categoryRepository.merge(category, updateCategoryDto);
        return await this.categoryRepository.save(updated);
    }

    async remove(id: number) {
        const category = await this.findOne(id);

        if (category.productos && category.productos.length > 0) {
            throw new BadRequestException('No se puede eliminar la categoría porque tiene productos asociados');
        }

        return await this.categoryRepository.remove(category);
    }
}