import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/test')
  async test() {
    // const room = await this.eventsService.findRoom({ users: [2, 1] });
    const room = await this.eventsService.createRoom();
  }
}
