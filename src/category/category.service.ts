import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../utils/types';
import { Category } from '../typeorm/entities/Category';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findCategoryByName(name: string) {
    return this.categoryRepository.findOneBy({ name });
  }

  findCategories() {
    return this.categoryRepository.find();
  }

  createCategory(storeDetails: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create({
      ...storeDetails,
      createdAt: new Date(),
    });
    return this.categoryRepository.save(newCategory);
  }

  updateCategory(id: number, updateCategoryDetails: UpdateCategoryDto) {
    return this.categoryRepository.update({ id }, { ...updateCategoryDetails });
  }

  deleteCategory(id: number) {
    return this.categoryRepository.delete({ id });
  }
}
