import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/prisma.service';
import { PlayerService } from 'src/player/player.service';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [GameGateway, GameService, PrismaService, PlayerService, EventsGateway]
})
export class GameModule {}
