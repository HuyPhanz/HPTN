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
  Req,
} from '@nestjs/common';

import { EventService } from './events.service';
import { CreateEventDto, UpdateEventDto } from '../utils/types';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get('')
  getEventsWithMeta(
    @Query('page') page: number = 1,
    @Query('perpage') perPage: number = 10,
    @Query('keyword') name: string,
  ) {
    return this.eventService.getEventWithMeta(page, perPage, name);
  }

  @Get('/all')
  getEvents() {
    return this.eventService.findEvents();
  }

  @Get(':id')
  findEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findEventById(id);
  }

  @Post()
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Patch(':id')
  updateEventById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  deleteEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.deleteEvent(id);
  }

  @Post(':eventId/stores/:storeId')
  addStoreToEvent(
    @Param('eventId') eventId: number,
    @Param('storeId') storeId: number,
  ) {
    return this.eventService.addStoreToEvent(storeId, eventId);
  }

  @Delete(':eventId/stores/:storeId')
  async removeStoreFromEvent(
    @Param('eventId') eventId: number,
    @Param('storeId') storeId: number,
  ) {
    return this.eventService.removeStoreFromEvent(storeId, eventId);
  }

  @Get(':id/list-stores')
  listStoresByEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.listStoresByEvent(id);
  }

  @Get(':id/list-stores-unassigned')
  listStoresNotInEvent(
    @Param('id', ParseIntPipe) id: number,
    @Query('keyword') name: string,
  ) {
    return this.eventService.listStoresNotInEvent(id, name);
  }
}
