import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly categoriesService: CategoriesService,
    ) { }

    async create(createProductDto: CreateProductDto) {
        await this.categoriesService.findOne(createProductDto.categoriaId);

        const product = this.productRepository.create({
            ...createProductDto,
            categoria: { id: createProductDto.categoriaId },
        });

        return await this.productRepository.save(product);
    }

    async findAll(page: number = 1, limit: number = 10, categoryId?: number, search?: string) {
        const skip = (page - 1) * limit;

        let where: any | any[] = {};

        if (search) {
            where = [
                { nombre: ILike(`%${search}%`) },
                { descripcion: ILike(`%${search}%`) },
            ];
        }

        if (categoryId) {
            if (Array.isArray(where)) {
                where = where.map((condition) => ({
                    ...condition,
                    categoria: { id: categoryId },
                }));
            } else {
                where = { categoria: { id: categoryId } };
            }
        }

        const [data, total] = await this.productRepository.findAndCount({
            where: where,
            take: limit,
            skip: skip,
            relations: { categoria: true },
            order: { createdAt: 'DESC' },
        });

        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: { categoria: true }
        });
        if (!product) throw new NotFoundException(`Producto #${id} no encontrado`);
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id);

        if (updateProductDto.categoriaId) {
            await this.categoriesService.findOne(updateProductDto.categoriaId);
            product.categoria = { id: updateProductDto.categoriaId } as any;
        }

        this.productRepository.merge(product, updateProductDto);
        return await this.productRepository.save(product);
    }

    async remove(id: number) {
        const product = await this.findOne(id);
        return await this.productRepository.remove(product);
    }
}