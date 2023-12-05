import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Events } from '../typeorm/entities/Event';
import { Store } from '../typeorm/entities/Store';

@Module({
  imports: [TypeOrmModule.forFeature([Events, Store])],
  providers: [EventService],
  controllers: [EventsController],
})
export class EventsModule {}
