import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateStoreDto, UpdateStoreDto } from '../utils/types';
import { StoreService } from './stores.service';

@Controller('stores')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get('')
  getUsersWithMeta(
    @Query('page') page: number = 1,
    @Query('perpage') perPage: number = 10,
  ) {
    return this.storeService.getStoreWithMeta(page, perPage);
  }

  @Get('/unassigned')
  getUnassignedStores() {
    return this.storeService.getUnassginedStore();
  }

  @Get(':id')
  findStoreById(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.findStoreById(id);
  }

  @Get('/all')
  getStores() {
    return this.storeService.findStores();
  }

  @Post()
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto);
  }

  @Patch(':id')
  updateStoreById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.updateStore(id, updateStoreDto);
  }

  @Delete(':id')
  deleteStoreById(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.deleteStore(id);
  }
}
