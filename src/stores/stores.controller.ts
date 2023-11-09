import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  getAllStores() {
    return this.storesService.getAllStores();
  }

  @Get(':id')
  getStoreById(@Param('id') id: string) {
    return this.storesService.getStoreById(id);
  }

  @Post()
  createStore(@Body() store) {
    this.storesService.createStore(store);
    return 'Store created successfully';
  }
}