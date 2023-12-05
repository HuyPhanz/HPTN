import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateProductDto, UpdateProductDto } from '../utils/types';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts() {
    return this.productService.findProducts();
  }

  @Post()
  createProduct(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @Patch(':id')
  updateStoreById(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, data);
  }

  @Delete(':id')
  deleteStoreById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
