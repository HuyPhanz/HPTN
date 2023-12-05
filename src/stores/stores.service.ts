import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateStoreDto, UpdateStoreDto } from '../utils/types';
import { Store } from '../typeorm/entities/Store';
import { Product } from '../typeorm/entities/Product';
import { wrapResponse, wrapResponseMeta } from '../utils/wrapResponse';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getStoreWithMeta(page: number, perpage: number) {
    const take = perpage || 10;
    const skip = (page - 1) * perpage;
    const [result, total] = await this.storeRepository.findAndCount({
      take: take,
      skip: skip,
      relations: ['products', 'category', 'event'],
    });

    return wrapResponseMeta(result, 200, 'OK', 'success', {
      current_page: page,
      total: total,
    });
  }

  findStoreByName(name: string) {
    return this.storeRepository.findOneBy({ name });
  }

  async findStoreById(id: number) {
    return wrapResponse(
      await this.storeRepository.findOne({
        where: { id },
        relations: ['products', 'event', 'user'],
      }),
      200,
      'OK',
      'Success',
    );
  }

  findStores() {
    return this.storeRepository.find({
      relations: ['products', 'category', 'user'],
    });
  }

  async createStore(storeDetails: CreateStoreDto) {
    const newStore = this.storeRepository.create({
      ...storeDetails,
      createdAt: new Date(),
    });

    return wrapResponse(
      await this.storeRepository.save(newStore),
      200,
      'OK',
      'Success',
    );
  }

  async updateStore(id: number, updateStoreDetails: UpdateStoreDto) {
    const store = await this.storeRepository.findOneBy({ id });

    if (!store) {
      // Handle not found scenarios
      throw new NotFoundException('Store not found');
    }

    // const products = await this.productRepository.findByIds(
    //   updateStoreDetails.products as number[],
    // );
    // store.products = products;

    return wrapResponse(
      await this.storeRepository.save({ ...store, ...updateStoreDetails }),
      200,
      'OK',
      'Success',
    );
  }

  deleteStore(id: number) {
    return this.storeRepository.delete({ id });
  }

  async getUnassginedStore() {
    return wrapResponse(
      await this.storeRepository.find({
        where: { user: IsNull() },
      }),
      200,
      'OK',
      'Success',
    );
  }
}
