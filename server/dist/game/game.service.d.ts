import { Socket } from "socket.io";
export declare class GameService {
    private games;
    private queue;
    private PlayersGames;
    private WatchersGames;
    private roomPrefix;
    newPlayer(client: Socket, user: any): any;
}
