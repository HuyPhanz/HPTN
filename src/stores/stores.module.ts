import { Module } from '@nestjs/common';
import { StoreService } from './stores.service';
import { StoreController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../typeorm/entities/Store';
import { ProductService } from '../product/product.service';
import { Product } from '../typeorm/entities/Product';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Product])],
  providers: [StoreService, ProductService],
  controllers: [StoreController],
})
export class StoresModule {}
