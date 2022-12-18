import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import Pong from './pong';
import { v4 as uuidv4 } from 'uuid';
// import { Player } from '@prisma/client';
import { Socket } from 'socket.io';
import pong from './pong';

@Injectable()
export class GameService {
  private games: Map<string, Pong> = new Map();
  private queue: any[] = [];
  private PlayersGames: any = [];
  private WatchersGames: any = [];
  private roomPrefix = 'roomGameSocket';

  newPlayer(client: Socket, user: any): any {
    console.log('Adding a new Player.', user);
    this.queue.push({ user: user, client });
    // console.log('this is the)
    if (this.queue.length === 2) {
      const gameId = uuidv4();
      console.log('QUEUE IS FULL .');

      const playerLeft = this.queue.shift();
      const playerRight = this.queue.shift();
      const game = new Pong(
        gameId,
        JSON.parse(playerLeft.user).nickname,
        JSON.parse(playerRight.user).nickname,
      );

      this.games.set(gameId, game);
      this.PlayersGames[playerLeft] = gameId;
      this.PlayersGames[playerRight] = gameId;
      const LeftSock: Socket = playerLeft.client;
      const RightSock: Socket = playerRight.client;
      LeftSock.join(this.roomPrefix + gameId);
      RightSock.join(this.roomPrefix + gameId);

      console.log('-----------------------------------------------');

      console.log('PlayerLeft : ', playerLeft);
      console.log('PlayerRight : ', playerRight);
      console.log('-----------------------------------------------');
      console.log('Game : ', game);



      //   playerLeft.client.join(this.roomPrefix + gameId);
      //   playerRight.client.join(this.roomPrefix + gameId);
      const replacerFunc = () => {
        const visited = new WeakSet();
        return (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (visited.has(value)) {
              return;
            }
            visited.add(value);
          }
          return value;
        };
      };
      // const PlayerLeftString = JSON.stringify(game.player_left, replacerFunc());
      // const PlayerRightString = JSON.stringify(game.player_right, replacerFunc());
      const pongData = JSON.stringify(game.update(game.player_left.id), replacerFunc());
      const rightData = JSON.stringify(game.update(game.player_right.id), replacerFunc());

      // console.log('gameId : ', gameId);
      LeftSock.to(this.roomPrefix + gameId).emit('matchFound', {
        // id: gameId,
        // player_left: PlayerLeftString,
        // player_right: PlayerRightString,
        // player_left: game.player_left.id,
        // player_right: game.player_right.id,
        pongData: pongData,
      });
      RightSock.to(this.roomPrefix + gameId).emit('matchFound', {
        // id: gameId,
        // player_left: this.games[gameId].player_left.id,
        // player_right: this.games[gameId].player_right.id,
        pongData: rightData,
      });
    }
    return { client: client, user: user };
  }

  // onUpdate(player: any, position: number): void {
  //   const gameId = this.PlayersGames[player];
  //   const game = this.games.get(gameId);
  //   if (game) {
  //     game.onUpdate(player, position);
  //     player.emit.to(this.roomPrefix + gameId).emit('update', game.update());
  //   }
  // }

  update(client: Socket, user: any): any {
    console.log("Inside  update ! " ,user.user);
    
    const parsed = JSON.parse(user.user);
    console.log("Inside  Position ! " ,user.positon);

    console.log("Parsed  update ! " ,parsed);


    const gameId = this.PlayersGames[user];
    const game = this.games.get(gameId);
    if (game) {

      console.log("Sending the infos ! ",game)

     


      const replacerFunc = () => {
        const visited = new WeakSet();
        return (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (visited.has(value)) {
              return;
            }
            visited.add(value);
          }
          return value;
        };
      };
      // const PlayerLeftString = JSON.stringify(game.player_left, replacerFunc());
      // const PlayerRightString = JSON.stringify(game.player_right, replacerFunc());

       // const LeftSock: Socket = game.player_left.id.client;
      // const RightSock: Socket = game.player_left.id.client;

         // LeftSock.to(this.roomPrefix + gameId).emit('update', {
      //   pongData:pongData
      // });
      // RightSock.to(this.roomPrefix + gameId).emit('update', 
      // {pongData:pongData});
      if(parsed.nickname == game.player_left.id)
      {
        console.log("its left" + game.player_left.id)
      game.onUpdate(game.player_left.id,user.positon)

      }
      else if (parsed.nickname == game.player_right.id)
      {
        console.log("its right" + game.player_right.id)

        game.onUpdate(game.player_right.id,user.positon)

      }
      const pongData = JSON.stringify(game.update(parsed.nickname), replacerFunc());
      
       client.to(this.roomPrefix + gameId).emit('update', {
        pongData:pongData
      });
   

    }
    // return game.update(user);
  }

  // getAllGames(): any{
  //   let games = [];
  //   this.games.forEach((game, key) => {
  //     games.push({
  //       id: key,
  //       player_left: game.player_left,
  //       player_right: game.player_right,
  //     });
  //   });
  //   return games;
  // }

  // watchGame(client: Socket, user:any, gameId:any): any {
  //   this.watchGame[user] = gameId;
  //   const game = this.games.get(gameId);
  //   if (game) {
  //     client.join(this.roomPrefix + gameId);
  //     game.spectators.add(user);
  //   }
  // }

  // leaveGameAsWatcher(client: Socket, userId:any): void {
  //   const gameId = this.watchGame[userId];
  //   const game = this.games.get(gameId);
  //   if (game) {
  //     if (client.in(this.roomPrefix + gameId))
  //       client.leave(this.roomPrefix + gameId);
  //     game.spectators.delete(userId);
  //   }
  // }

  // leaveGameAsPlayer(user:any): void {
  //   const gameId = this.PlayersGames[user];
  //   const game = this.games.get(gameId);
  //   if (game) {
  //     if (game.player_left.id === user) {
  //       this.games.delete(gameId);
  //     }
  //     else if (game.player_right.id === user) {
  //       this.games.delete(gameId);
  //     }
  //   }
  // }

  // newGame(playerLeft:any, playerRight:any): void {
  //   let gameId = uuidv4();
  //   // const game = new Pong(user1, user2);
  //   // this.games.set(gameId, game);
  //   // this.PlayersGames[user1] = gameId;
  //   // this.PlayersGames[user2] = gameId;
  //   // let playerLeft = {user:user1, client:Socket}
  //   const game = new Pong({user:playerLeft.user, client:playerLeft.socket},
  //     {user:playerLeft.user, client:playerLeft.socket});
  //   this.games.set(gameId, game);
  //   this.PlayersGames[playerRight] = gameId;
  //   this.PlayersGames[playerRight] = gameId;
  //   playerLeft.client.join(this.roomPrefix + gameId);
  //   playerRight.client.join(this.roomPrefix + gameId);

  //   playerLeft.socket.to(this.roomPrefix + gameId).emit('newGame', {
  //     id: gameId,
  //     player_left: game.player_left,
  //     player_right: game.player_right,
  //   });
  // }
}

