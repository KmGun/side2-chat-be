import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entity/member.entity';
import { Room } from 'src/entity/room.entity';
import { EventsGateWay } from './events.gateway';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [EventsGateWay, EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
