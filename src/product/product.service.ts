import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../utils/types';
import { Product } from '../typeorm/entities/Product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  findByName(name: string) {
    return this.productRepository.findOneBy({ name });
  }

  findProducts() {
    return this.productRepository.find({ relations: ['category'] });
  }

  createProduct(details: CreateProductDto) {
    const newProduct = this.productRepository.create({
      ...details,
      createdAt: new Date(),
    });
    return this.productRepository.save(newProduct);
  }

  updateProduct(id: number, details: UpdateProductDto) {
    return this.productRepository.update({ id }, { ...details });
  }

  deleteProduct(id: number) {
    return this.productRepository.delete({ id });
  }
}
