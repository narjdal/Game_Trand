export default class pong {
    player_left: any;
    player_right: any;
    ball: any;
    music: string;
    spectators: any;
    constructor(player1: any, player2: any);
    reset_ball(): void;
    collison(player: any): boolean;
    onUpdate(playerId: string, position_2: number): any;
    update(): any;
}
