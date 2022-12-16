import { Socket } from "socket.io";
import { GameService } from './game.service';
import { PlayerService } from "src/player/player.service";
export declare class GameGateway {
    private readonly gameService;
    private readonly playerservice;
    wss: Socket;
    private roomPrefix;
    constructor(gameService: GameService, playerservice: PlayerService);
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleNewPlayer(client: Socket, user: any): Promise<void>;
}
