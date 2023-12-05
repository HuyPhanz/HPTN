import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/Profile';
import { Store } from './typeorm/entities/Store';
import { Product } from './typeorm/entities/Product';
import { Category } from './typeorm/entities/Category';
import { Events } from './typeorm/entities/Event';
import { StoresModule } from './stores/stores.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Huy1722001#',
      database: 'event_manager',
      entities: [User, Profile, Store, Product, Category, Events],
      synchronize: true,
    }),
    UsersModule,
    // PassportModule.register({ defaultStrategy: 'bearer' }),
    // UserModule,
    AuthModule,
    // StoresModule,
    EventsModule,
    StoresModule,
    CategoryModule,
    ProductModule,
    // StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
