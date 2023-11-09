import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  private events = [];

  createEvent(event) {
    this.events.push(event);
  }

  getAllEvents() {
    return this.events;
  }

  getEventById(id) {
    return this.events.find((event) => event.id === id);
  }
}