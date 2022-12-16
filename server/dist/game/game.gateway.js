"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
const player_service_1 = require("../player/player.service");
let GameGateway = class GameGateway {
    constructor(gameService, playerservice) {
        this.gameService = gameService;
        this.playerservice = playerservice;
        this.roomPrefix = 'roomGameSocket';
    }
    async handleConnection(client, ...args) {
        console.log("Client connected", client.id);
    }
    async handleDisconnect(client) {
        console.log("Client disconnected", client.id);
    }
    async handleNewPlayer(client, user) {
        console.log("newPlayer", client.id, user);
        return this.gameService.newPlayer(client, user);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Socket)
], GameGateway.prototype, "wss", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("newPlayer"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleNewPlayer", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "game",
        cors: {
            origin: "*",
        },
    }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        player_service_1.PlayerService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map