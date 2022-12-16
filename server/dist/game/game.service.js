"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const pong_1 = require("./pong");
const uuid_1 = require("uuid");
let GameService = class GameService {
    constructor() {
        this.games = new Map();
        this.queue = [];
        this.PlayersGames = [];
        this.WatchersGames = [];
        this.roomPrefix = 'roomGameSocket';
    }
    newPlayer(client, user) {
        console.log("Adding a new Player.", user);
        this.queue.push({ user: user, client });
        if (this.queue.length === 2) {
            let gameId = (0, uuid_1.v4)();
            console.log("QUEUE IS FULL .");
            const playerLeft = this.queue.shift();
            const playerRight = this.queue.shift();
            const game = new pong_1.default(playerLeft, playerRight);
            this.games.set(gameId, game);
            this.PlayersGames[playerLeft] = gameId;
            this.PlayersGames[playerRight] = gameId;
            const LeftSock = playerLeft.client;
            const RightSock = playerRight.client;
            LeftSock.join(this.roomPrefix + gameId);
            RightSock.join(this.roomPrefix + gameId);
            console.log("-----------------------------------------------");
            console.log("PlayerLeft : ", playerLeft.user);
            console.log("PlayerRight : ", playerRight.user);
            const replacerFunc = () => {
                const visited = new WeakSet();
                return (key, value) => {
                    if (typeof value === "object" && value !== null) {
                        if (visited.has(value)) {
                            return;
                        }
                        visited.add(value);
                    }
                    return value;
                };
            };
            const PlayerLeftString = JSON.stringify(game.player_left, replacerFunc());
            const PlayerRightString = JSON.stringify(game.player_right, replacerFunc());
            LeftSock.to(this.roomPrefix + gameId).emit('matchFound', {
                id: gameId,
                player_left: PlayerLeftString,
                player_right: PlayerRightString
            });
            RightSock.to(this.roomPrefix + gameId).emit('matchFound', {
                id: gameId,
                player_left: PlayerLeftString,
                player_right: PlayerRightString
            });
        }
        return { client: client, user: user };
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map