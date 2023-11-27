import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { StoresService } from '../stores/stores.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class StatisticsService {
  constructor(
    private productService: ProductsService,
    private storeService: StoresService,
    private eventsService: EventsService,
  ) {}

  getTotalProducts() {
    return this.productService.getAllProducts().length;
  }

  getTotalStores() {
    return this.storeService.getAllStores().length;
  }

  getProductsByStore(storeId) {
    const store = this.storeService.getStoreById(storeId);
    if (store) {
      return store.products;
    }
    return null;
  }

  getTotalEvents() {
    return this.eventsService.getAllEvents().length;
  }
}
