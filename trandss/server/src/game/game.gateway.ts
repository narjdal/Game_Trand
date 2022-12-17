import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage
} from '@nestjs/websockets';
import { Socket } from "socket.io";
import { GameService } from './game.service';
import { JwtService } from "@nestjs/jwt";
// import { PrismaService } from "src/prisma.service";
// import { PlayerService } from "src/player/player.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@WebSocketGateway({
	namespace: "game",
	cors: {
		origin: "*",
	},
})
export class GameGateway {
  @WebSocketServer() wss: Socket;
  private roomPrefix = 'roomGameSocket';

  constructor(
    private readonly gameService: GameService,
    /*private readonly playerservice: PlayerService*/) {
    }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log("Client connected", client.id);
  }

  async handleDisconnect(client: Socket) {
		console.log("Client disconnected", client.id);
	}

  @SubscribeMessage("newPlayer")
  async handleNewPlayer(client: Socket, user: any): Promise<void> {
    console.log("newPlayer", client.id, user);
    return this.gameService.newPlayer(client, user);
  }

  // @SubscribeMessage("onUpdate")
  // async handleOnUpdate(client: Socket, data: any): Promise<void> {
  //   return this.gameService.onUpdate(user, data.position);
  // }

  @SubscribeMessage("update")
	async handleUpdate(client: Socket, user: any): Promise<void> {
    return this.gameService.update(client, user);
	}

  // @SubscribeMessage("getAllGames")
	// async handleGetAllGames(client: Socket, data: any): Promise<void> {
  //   let user = await this.checkUSer(data.user);
  //   if (user === null)
  //     return;
  //   return this.gameService.getAllGames();
	// }

  // @SubscribeMessage("watchGame")
	// async handleWatchGame(client: Socket, data: any): Promise<void> {
  //   let user = await this.checkUSer(data.user);
  //   if (user === null)
  //     return;
  //   return this.gameService.watchGame(client, user, data.gameId);
	// }

  // @SubscribeMessage("leaveGameAsWatcher")
	// async handleLeaveGameAsWatcher(client: Socket, data: any): Promise<void> {
	// 	if (!data.user)
	// 		return;
	// 	const user = await this.playerservice.findPlayerById(data.user.id);
	// 	if (!user)
	// 		return;
	// 	if (!data.room)
	// 		return;
	// 	const room = await this.playerservice.getRoomById(data.user.id,data.room);
	// 	if (!room)
	// 		return;
  //   return this.gameService.leaveGameAsWatcher(user);
	// }

  // @SubscribeMessage("leaveGameAsPlayer")
	// async handleLeaveGameAsPlayer(client: Socket, data: any): Promise<void> {
  //   let user = await this.checkUSer(data.user);
  //   if (user === null)
  //     return;
  //   return this.gameService.leaveGameAsPlayer(user);
	// }

  // async checkUSer(user:any): Promise<any>{
  //   if (!user)
	// 		return (null);
	// 	const User = await this.playerservice.findPlayerById(user.id);
	// 	if (!user)
	// 		return (null);
  //   return (User);
  // }
}

