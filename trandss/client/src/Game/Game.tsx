import p5Types from "p5";
import Sketch from "react-p5";
import { useState, useEffect } from 'react';
import p5 from "p5";
import pong from "./Pong";
import "./Game.css";
import io from 'socket.io-client';

const buttonsStyle = (width: number, height: number, button: any,
  x: number, y: number) => {
  let margin = `${width * 0.25}`.toString() + "px";
  button.show();
  button.style("left, " + margin);
  button.style("right, " + margin);
  button.style("width", `${width * 0.5}`.toString() + "px");
  button.position(x, y);
  button.style("height", `${height * 0.1}`.toString() + "px");
  button.mouseOver(() => {
    // button.style('background-color', '#f2f2f2');
  });
};

const handleNewPlayerPosition = (postion: number) : number => {
  if (postion <= 0) {
    return 0;
  }
  if (postion >= 0.75) {
    return 0.75;
  }
  return postion;
}

const buttonRemove = (button: any) => {
  button.hide();
  button.remove(button);
};

const pongDataParser = (pongData: any) => {
  const player_left = JSON.parse(pongData.player_left);
  const player_right = JSON.parse(pongData.player_right);
  const ball = JSON.parse(pongData.pongData);
  
  // console.log("playerLeft", typeof(JSON.parse(JSON.parse(pongData.player_left).id.user)), JSON.parse(JSON.parse(pongData.player_left).id.user).nickname);
  console.log("ball", typeof(pongData.pongData),  JSON.parse(pongData.pongData));
  // console.log("parsing", pongData);
  // console.log("gameId", pongData.id);
  return {
    gameId: pongData.id,
    playerLeft: { name: JSON.parse(player_left.id.user).nickname, position: player_left.y, score: player_left.score, },
    playerRight: { name: JSON.parse(JSON.parse(pongData.player_right).id.user).nickname, position: JSON.parse(pongData.player_right).y , score: pongData.player_right_score, },
    ball: ball,
    isPlaying: JSON.parse(pongData.pongData).isPlaying,
    musicIndice: JSON.parse(pongData.pongData).musicIndice,
    userRool: JSON.parse(pongData.pongData).userRool,
  };
};

export type IplayPong = {
  gameId?: string;
  playerLeft: { name: string; position: number; score: number; };
  playerRight: {name: string; position: number; score: number;};
  ball: { x: number; y: number; };
  isPlaying: boolean;
  musicIndice: string;
  userRool: string;
};

export interface IGameContextProps {
  pongClass: any;
  numberOfPlayers: number;
  playerTool: string;
  difficulty: string;
  mode: string;
  buttons: { online?: any; offline?: any; oneplayer?: any; twoplayer?: any; mouse?: any;
    keybord?: any; easy?: any; medium?: any; hard?: any; };
  sound: { hit: any; wall: any; left: any; right: any; };
  pongData: IplayPong;
  radius: number;
  socket:any;
  gameStatue: string;
  playerPosition: number;

  setNumberOfPlayers: (ctx: p5.Renderer, width: number, height: number, buttons: any) => void;
  setPlayerTool: (ctx: p5.Renderer, width: number, height: number, buttons: any) => void;
  setDifficulty: (ctx: p5.Renderer, width: number, height: number, buttons: any) => void;
  setMode: (ctx: p5.Renderer, width: number, height: number, buttons: any) => void;
  setPongData: (pongData: IplayPong) => void;
}

const defaultState: IGameContextProps = {
  pongClass: null,
  numberOfPlayers: 0,
  playerTool: "",
  difficulty: "",
  mode: "",
  buttons: { online: null, offline: null, oneplayer: null, twoplayer: null, mouse: null,
    keybord: null, easy: null, medium: null, hard: null, },
  sound: { hit: null, wall: null, left: null, right: null, },
  pongData: {
    playerLeft: { name: "", position: 0.375, score: 0, },
    playerRight: { name: "", position: 0.375, score: 0, },
    ball: { x: 0.5, y: 0.5, },
    isPlaying: false,
    musicIndice: "",
    userRool: "",
  },
  radius: 0,
  socket: null,
  gameStatue: "Inloading",
  playerPosition: 0.375,
  setMode: (ctx: p5.Renderer, width: number, height: number, buttons: any) => {
    buttonsStyle(width, height, buttons.online, ctx.position().x + width * 0.25,
      ctx.position().y + height * 0.38);
    buttonsStyle(width, height, buttons.offline, ctx.position().x + width * 0.25,
      ctx.position().y + height * 0.52);
    buttons.online.mousePressed(() => {
      defaultState.mode = "online";
      defaultState.numberOfPlayers = 2;
      buttonRemove(buttons.online);
      buttonRemove(buttons.offline);
    });
    buttons.offline.mousePressed(() => {
      defaultState.mode = "offline";
      buttonRemove(buttons.offline);
      buttonRemove(buttons.online);
    });
  },

  setNumberOfPlayers: (ctx: p5.Renderer, width: number, height: number, buttons: any) => {
    buttonsStyle(width, height, buttons.oneplayer, ctx.position().x + width * 0.25,
      ctx.position().y + height * 0.38);
    buttonsStyle(width, height, buttons.twoplayer, ctx.position().x + width * 0.25,
      ctx.position().y + height * 0.52);
    buttons.oneplayer.mousePressed(() => {
      defaultState.numberOfPlayers = 1;
      buttonRemove(buttons.oneplayer);
      buttonRemove(buttons.twoplayer);
    });
    buttons.twoplayer.mousePressed(() => {
      defaultState.numberOfPlayers = 2;
      buttonRemove(buttons.oneplayer);
      buttonRemove(buttons.twoplayer);
    });
  },

  setPlayerTool: (ctx: p5.Renderer, width: number, height: number, buttons: any) => {
    buttonsStyle(width, height, buttons.mouse, ctx.position().x + width * 0.25,
      ctx.position().y + height * 0.38);
    buttonsStyle(width, height, buttons.keybord, ctx.position().x + width * 0.25,
      ctx.position().y + height * 0.52);
    buttons.mouse.mousePressed(() => {
      defaultState.playerTool = "mouse";
      buttonRemove(buttons.mouse);
      buttonRemove(buttons.keybord);
    });
    buttons.keybord.mousePressed(() => {
      defaultState.playerTool = "keybord";
      buttonRemove(buttons.mouse);
      buttonRemove(buttons.keybord);
    });
  },

  setDifficulty: (ctx: p5.Renderer, width: number, height: number, buttons: any) => {
    buttonsStyle(width, height, buttons.easy, ctx.position().x + width * 0.25,
      ctx.position().y + height * 0.31
    );
    buttonsStyle(width, height, buttons.medium, ctx.position().x + width * 0.25,
      ctx.position().y + height * 0.45);
    buttonsStyle(width, height, buttons.hard, ctx.position().x + width * 0.25,
      ctx.position().y + height * 0.59);
    buttons.easy.mousePressed(() => {
      defaultState.difficulty = "easy";
      buttonRemove(buttons.easy);
      buttonRemove(buttons.medium);
      buttonRemove(buttons.hard);
    });
    buttons.medium.mousePressed(() => {
      defaultState.difficulty = "medium";
      buttonRemove(buttons.easy);
      buttonRemove(buttons.medium);
      buttonRemove(buttons.hard);
    });
    buttons.hard.mousePressed(() => {
      defaultState.difficulty = "hard";
      buttonRemove(buttons.easy);
      buttonRemove(buttons.medium);
      buttonRemove(buttons.hard);
    });
  },
  setPongData: (pongData: IplayPong) => {
    defaultState.pongData = pongData;
  },
};

export default function Game(props: any) {
  const [gameState, setGameState] = useState(defaultState);
  const [askToJoin, setAskToJoin] = useState(false);

  let ctx: any;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    ctx = p5.createCanvas(props.width, props.height).parent(canvasParentRef);
    gameState.radius = Math.sqrt(props.width * props.width + props.height * props.height) * 0.028;

    gameState.buttons.online = p5.createButton("Online");
    gameState.buttons.online.hide();
    gameState.buttons.online.addClass("mode");

    gameState.buttons.offline = p5.createButton("Offline");
    gameState.buttons.offline.hide();
    gameState.buttons.offline.addClass("mode");

    gameState.buttons.oneplayer = p5.createButton("ONE PLAYER");
    gameState.buttons.oneplayer.hide();
    gameState.buttons.oneplayer.addClass("numberOfPlayers");

    gameState.buttons.twoplayer = p5.createButton("TWO PLAYERS");
    gameState.buttons.twoplayer.hide();
    gameState.buttons.twoplayer.addClass("numberOfPlayers");

    gameState.buttons.mouse = p5.createButton("MOUSE");
    gameState.buttons.mouse.hide();
    gameState.buttons.mouse.addClass("toolsPlayer");

    gameState.buttons.keybord = p5.createButton("KEYBORD");
    gameState.buttons.keybord.hide();
    gameState.buttons.keybord.addClass("toolsPlayer");

    gameState.buttons.easy = p5.createButton("EASY");
    gameState.buttons.easy.hide();
    gameState.buttons.easy.addClass("difficulty");

    gameState.buttons.medium = p5.createButton("MEDIUM");
    gameState.buttons.medium.hide();
    gameState.buttons.medium.addClass("difficulty");

    gameState.buttons.hard = p5.createButton("HARD");
    gameState.buttons.hard.hide();
    gameState.buttons.hard.addClass("difficulty");

    gameState.sound.hit = new Audio(require("./assets/hit.mp3"));
    gameState.sound.wall = new Audio(require("./assets/wall.mp3"));
    gameState.sound.left = new Audio(require("./assets/left.mp3"));
    gameState.sound.right = new Audio(require("./assets/right.mp3"));

    // p5.frameRate(1);
  };
  useEffect(() => {

    gameState.socket = io("http://localhost:5000/game");
    gameState.socket.on("connect", () => {
      // console.log(gameState.socket);
    });

  },[])
  const [JoinedQueue,setJoingedQueue] = useState(false);
  const [Playing ,setPlaying] = useState(false);
  useEffect(() => {
    if(JoinedQueue)
    {
      gameState.socket.emit ("newPlayer", localStorage.getItem("user")!);
      gameState.socket.on("matchFound", (data: any) => {
        gameState.pongData = JSON.parse(data.pongData);
        console.log("PongData : ",data.pongData)
        gameState.gameStatue = "Playing";
        setPlaying(true);
      });
    }
   
  },[JoinedQueue])

  useEffect(() => {
    if(Playing){
      console.log("update player");
      gameState.socket.on("update", (data: any) => {
        gameState.pongData = JSON.parse(data.pongData);
        console.log(gameState.pongData);
        if (gameState.pongData.isPlaying)
          setPlaying(true);
        else
          setPlaying(false);
      });
    }
  },[Playing])

  const draw = (p5: p5Types) => {
    p5.fill(42, 71, 137);
    p5.rect(0, 0, props.width, props.height);
    if (gameState.gameStatue === "Inloading") {
      if (gameState.mode === "offline" && gameState.difficulty === "" &&
        gameState.numberOfPlayers === 1 && gameState.playerTool !== "") {
          gameState.setDifficulty(ctx, props.width, props.height, gameState.buttons);
      }
      else if ((gameState.mode === "online" || gameState.numberOfPlayers === 1)
        && gameState.playerTool === "") {
        gameState.setPlayerTool(ctx, props.width, props.height, gameState.buttons);
      }
      else if (gameState.mode !== "" && gameState.numberOfPlayers === 0) {
        gameState.setNumberOfPlayers(ctx, props.width, props.height, gameState.buttons);
      }
      else if (gameState.mode === "") {
        gameState.setMode(ctx, props.width, props.height, gameState.buttons);
      }
      else{
        if (gameState.mode === "online")
          defaultState.gameStatue = "WaitingPlayers";
        else
          defaultState.gameStatue = "loadingGameHorsLigne";
      }
    }
    else if (gameState.gameStatue === "WaitingPlayers") {
      if (gameState.socket && !JoinedQueue) {
        setJoingedQueue(true);
      }
      p5.textSize(32);
      p5.fill(255);
      p5.text("Waiting for a player", props.width / 2 - 150, props.height / 4);
    }
    else if (gameState.gameStatue === "loadingGameHorsLigne") {
      if (gameState.mode === "offline" && gameState.numberOfPlayers === 1) {
        gameState.pongClass = new pong("user", "IA");
        gameState.gameStatue = "Playing";
      }
      else if (gameState.mode === "offline" && gameState.numberOfPlayers === 2) {
        gameState.pongClass = new pong("mouse", "keybord");
        gameState.gameStatue = "Playing";
      }
    }
    if (gameState.gameStatue === "Playing") {
      if (gameState.mode === "online") {
        if (gameState.playerTool === "mouse" && p5.mouseY > 0 &&
          p5.mouseY < props.height - props.height / 4) {
            gameState.playerPosition = p5.mouseY / props.height;
        }
        else if (gameState.playerTool === "keybord") {
          if (p5.keyIsDown(p5.UP_ARROW) && gameState.playerPosition > 0) {
            gameState.pongData.playerLeft.position -= 0.03;
          }
          else if (p5.keyIsDown(p5.DOWN_ARROW) && gameState.pongData.playerLeft.position < 0.75) {
            gameState.playerPosition += 0.03;
          }
        }
        if (gameState.socket && ((gameState.playerPosition
           !== gameState.pongData.playerLeft.position
        /*  && gameState.pongData.userRool === "left" */) || (gameState.playerPosition !==
          gameState.pongData.playerRight.position 
          /*&& gameState.pongData.userRool === "right"*/
          ))) {
            // console.log("Emiting an OnUpdate ");
            gameState.socket.emit("update", { positon: gameState.playerPosition});
          }
        console.log('check', gameState.socket && Playing)
        if (gameState.socket && Playing) {
            setPlaying(true);
        }
      }
      else if (gameState.mode === "offline" && gameState.numberOfPlayers === 1) {
        if (gameState.playerTool === "mouse" && p5.mouseY > 0 &&
          p5.mouseY < props.height - props.height / 4) {
          gameState.pongData.playerLeft.position = p5.mouseY / props.height;
        }
        else if (gameState.playerTool === "keybord") {
          if (p5.keyIsDown(p5.UP_ARROW) && gameState.pongData.playerLeft.position > 0) {
            gameState.pongData.playerLeft.position -= 0.03;
          }
          if (p5.keyIsDown(p5.DOWN_ARROW) && gameState.pongData.playerLeft.position < 0.75) {
            gameState.pongData.playerLeft.position += 0.03;
          }
        }
        gameState.pongData = gameState.pongClass.update(gameState.pongData.playerLeft.position);
      }
      else if (gameState.mode === "offline" && gameState.numberOfPlayers === 2) {
        if (p5.mouseY > 0 && p5.mouseY < props.height - props.height / 4) {
          gameState.pongData.playerLeft.position = p5.mouseY / props.height;
        }
        if (p5.keyIsDown(p5.UP_ARROW) && gameState.pongData.playerRight.position > 0) {
          gameState.pongData.playerRight.position -= 0.03;
        }
        if (p5.keyIsDown(p5.DOWN_ARROW) && gameState.pongData.playerRight.position < 0.75) {
          gameState.pongData.playerRight.position += 0.03;
        }
        gameState.pongData = gameState.pongClass.update(gameState.pongData.playerLeft.position,
          gameState.pongData.playerRight.position);
      }
      if (gameState.pongData.isPlaying){
        p5.fill(0, 0, 102);
        p5.textSize(props.width / 15);
        p5.text(gameState.pongData.playerLeft.score, props.width / 4, props.height / 8);
        p5.text(gameState.pongData.playerRight.score, (props.width * 3) / 4, props.height / 8);
        p5.textSize(props.width / 20);
        p5.text(gameState.pongData.playerLeft.name, (props.width * 3) / 16, (props.height * 2) / 8);
        p5.text(gameState.pongData.playerRight.name, (props.width * 11) / 16, (props.height * 2) / 8);
        for (let i = 0; i <= 10; i++) {
          p5.rect(props.width * 0.49, (i * props.height) / 8, props.width * 0.02, props.height / 20);
        }
        p5.fill(192, 238, 253);
        p5.circle(gameState.pongData.ball.x * props.width, gameState.pongData.ball.y * props.height,
          gameState.radius);
        p5.fill(102, 181, 255);
        p5.rect(0, gameState.pongData.playerLeft.position * props.height, props.width / 60,
        props.height / 4);
        p5.fill(77, 77, 255);
        p5.rect(props.width - props.width / 60,
        gameState.pongData.playerRight.position * props.height, props.width / 60, props.height / 4);
        if (gameState.pongData.musicIndice === "hit") {
          gameState.sound.hit.play();
        }
        if (gameState.pongData.musicIndice === "left") {
          gameState.sound.left.play();
        }
        if (gameState.pongData.musicIndice === "right") {
          gameState.sound.right.play();
        }
        if (gameState.pongData.musicIndice === "wall") {
          gameState.sound.wall.play();
        }
      }
      else if (gameState.gameStatue === "Playing") {
        gameState.gameStatue = "endGame";
      }
    }
    else if (gameState.gameStatue === "endGame") {
      p5.background(0);
      p5.fill(255);
      p5.textSize(props.width / 10);
      p5.text("Game Over", props.width / 4, props.height / 2);
      p5.textSize(props.width / 20);
      p5.text("Press Space To Play Again", props.width / 4, (props.height * 3) / 4);
      if (p5.keyIsDown(p5.ENTER)) {
        window.location.reload();
      }
    }
  }
  return (
    <div className="App">
      <Sketch setup={setup} draw={draw}/>
    </div>
  );
}
