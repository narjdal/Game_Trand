const width = 600;
const height = 400;

export default class pong {
  player_left: any;
  player_right: any;
  ball: any;
  music: string;
  spectators: any;

  constructor(player1: any, player2: any) {
    this.spectators = new Set();
    this.ball = {
      x: width / 2,
      y: height / 2,
      radius: 10,
      speed: 11,
      velocity_X: 5,
      velocity_Y: 5,
    };
    this.player_left = {
      id: player1,
      x: 0,
      y: (height - 100) / 2,
      width: 10,
      height: 100,
      score: 0,
    };
    this.player_right = {
      id: player2,
      x: width - 10,
      y: (height - 100) / 2,
      width: 10,
      height: 100,
      score: 0,
    };
    this.music = "";
  }

  reset_ball(): void {
    this.ball.x = width / 2;
    this.ball.y = height / 2;
    this.ball.speed = 11;
    this.ball.velocity_X *= -1;
  }

  collison(player: any): boolean {
    return (
      player.x < this.ball.x + this.ball.radius &&
      player.x + player.width > this.ball.x - this.ball.radius &&
      player.y < this.ball.y + this.ball.radius &&
      player.y + player.height > this.ball.y - this.ball.radius
    );
  }

  onUpdate(playerId: string, position_2: number): any {
    if (playerId === this.player_left.id) {
      this.player_left.y = position_2 * height;
    }
    else if (playerId === this.player_right.id) {
      this.player_right.y = position_2 * height;
    }
  }

  update(): any {
    this.music = "";
    if (this.ball.x - this.ball.radius < 0) {
      this.player_right.score++;
      this.reset_ball();
      this.music = "right";
    } else if (this.ball.x + this.ball.radius > width) {
      this.player_left.score++;
      this.reset_ball();
      this.music = "left";
    }
    this.ball.x += this.ball.velocity_X;
    this.ball.y += this.ball.velocity_Y;

    //wall collision
    if (
      this.ball.y < this.ball.radius ||
      this.ball.y + this.ball.radius > height
    ) {
      this.ball.velocity_Y *= -1;
      this.music = "wall";
    }
    //player collision
    let player = this.ball.x < width / 2 ? this.player_left : this.player_right;
    if (this.collison(player)) {
      this.music = "hit";
      let collide_point = this.ball.y - (player.y + player.height / 2);
      collide_point = collide_point / (player.height / 2);
      let angle_rad = (Math.PI / 4) * collide_point;
      let direction = this.ball.x + this.ball.radius < width / 2 ? 1 : -1;
      this.ball.velocity_X = direction * this.ball.speed * Math.cos(angle_rad);
      this.ball.velocity_Y = this.ball.speed * Math.sin(angle_rad);
      this.ball.speed += 0.3;
    }
    return {
      playerLeft: {
        name: this.player_left.id,
        position: this.player_left.y / height,
        score: this.player_left.score,
      },
      playerRight: {
        name: this.player_right.id,
        position: this.player_right.y / height,
        score: this.player_right.score,
      },
      ball: {
        x: this.ball.x / width,
        y: this.ball.y / height,
      },
      isPlaying: this.player_left.score < 5 && this.player_right.score < 5,
      musicIndice: this.music,
      userRool: "",
    };
  }
}
