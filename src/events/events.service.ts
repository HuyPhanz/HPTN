import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Raw, Repository } from 'typeorm';
import { Events } from '../typeorm/entities/Event';
import { CreateEventDto, UpdateEventDto } from '../utils/types';
import { wrapResponse, wrapResponseMeta } from '../utils/wrapResponse';
import { Store } from '../typeorm/entities/Store';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Events) private eventRepository: Repository<Events>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
  ) {}

  async getEventWithMeta(page: number, perpage: number, name: string) {
    const take = perpage || 10;
    const skip = (page - 1) * perpage;
    const [result, total] = await this.eventRepository.findAndCount({
      take: take,
      skip: skip,
      relations: ['stores'],
      where: { name: ILike(`%${name ?? ''}%`) },
    });

    return wrapResponseMeta(result, 200, 'OK', 'success', {
      current_page: page,
      total: total,
    });
  }

  findEventByName(name: string) {
    return this.eventRepository.findOneBy({ name });
  }

  async findEventById(id: number) {
    return wrapResponse(
      await this.eventRepository.findOneBy({ id }),
      200,
      'OK',
      'success',
    );
  }

  findEvents() {
    return this.eventRepository.find({ relations: ['stores'] });
  }

  async createEvent(eventDetails: CreateEventDto) {
    const newEvent = this.eventRepository.create({
      ...eventDetails,
      createdAt: new Date(),
    });
    return wrapResponse(
      await this.eventRepository.save(newEvent),
      200,
      'OK',
      'success',
    );
  }

  async updateEvent(id: number, updateEventDetails: UpdateEventDto) {
    return wrapResponse(
      await this.eventRepository.update(
        { id },
        {
          ...updateEventDetails,
        },
      ),
      200,
      'OK',
      'success',
    );
  }

  deleteEvent(id: number) {
    return this.eventRepository.delete({ id });
  }

  async addStoreToEvent(storeId: number, eventId: number) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['stores'],
    });

    if (!store || !event) {
      throw new NotFoundException('Store or Event not found');
    }

    event.stores = [...event.stores, store];
    await this.eventRepository.save(event);

    return wrapResponse(event, 200, 'OK', 'success');
  }

  async removeStoreFromEvent(storeId: number, eventId: number) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['stores'],
    });

    if (!store || !event) {
      throw new NotFoundException('Store or Event not found');
    }

    event.stores = event.stores.filter((s) => s.id !== store.id);
    await this.eventRepository.save(event);

    return wrapResponse(event, 200, 'OK', 'success');
  }

  async listStoresByEvent(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['stores'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return wrapResponseMeta(event.stores, 200, 'OK', 'success', {
      current_page: 1,
      total: 50,
    });
  }

  async listStoresNotInEvent(id: number, name: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['stores'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Find stores that are NOT in the list of stores associated with the event
    const storesNotInEvent = await this.storeRepository.find({
      where: {
        event: IsNull(),
        name: ILike(`%${name ?? ''}%`),
      },
    });

    return wrapResponseMeta(storesNotInEvent, 200, 'OK', 'success', {
      current_page: 1,
      total: 50,
    });
  }
}
