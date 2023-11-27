import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get('/total-products')
  getTotalProducts() {
    return { totalProducts: this.statisticsService.getTotalProducts() };
  }

  @Get('/total-stores')
  getTotalStores() {
    return { totalStores: this.statisticsService.getTotalStores() };
  }

  @Get('/products-by-store/:storeId')
  getProductsByStore(@Param('storeId') storeId: string) {
    return { products: this.statisticsService.getProductsByStore(storeId) };
  }

  @Get('/total-events')
  getTotalEvents() {
    return { totalEvents: this.statisticsService.getTotalEvents() };
  }
}
