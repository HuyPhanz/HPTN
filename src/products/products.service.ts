import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private products = [];

  createProduct(product) {
    this.products.push(product);
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }
}
