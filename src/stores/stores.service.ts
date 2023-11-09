import { Injectable } from '@nestjs/common';

@Injectable()
export class StoresService {
  private stores = [];

  createStore(store) {
    this.stores.push(store);
  }

  getAllStores() {
    return this.stores;
  }

  getStoreById(id) {
    return this.stores.find((store) => store.id === id);
  }
}
