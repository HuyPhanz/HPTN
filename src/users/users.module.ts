import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Profile } from '../typeorm/entities/Profile';
import { Store } from '../typeorm/entities/Store';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Store])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
