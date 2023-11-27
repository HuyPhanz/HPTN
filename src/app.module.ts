import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StoresModule } from './stores/stores.module';
import { EventsModule } from './events/events.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';
import { PointsService } from './points/points.service';
import { PointsController } from './points/points.controller';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StoresModule,
    EventsModule,
    StatisticsModule,
  ],
  controllers: [AppController, ProductsController, PointsController],
  providers: [AppService, ProductsService, PointsService],
})
export class AppModule {}
