import { Game } from "./core/Game";
import { CONFIG } from "./utils/Config";

import { Player } from "./entities/Player";
import { EventEmitter } from "./core/EventEmitter";

import "./style.css";
import { InputHandler } from "./systems/InputHandler";

const initializeApp = () => {
  // Select the canvas element
  const canvas = document.querySelector(
    ".space__invader-canvas"
  ) as HTMLCanvasElement;

  //Rendering context
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  //Set the width and height of the canvas element
  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;

  const eventEmitter = new EventEmitter();

  const player = new Player(eventEmitter);
  const inputHandler = new InputHandler(eventEmitter);

  inputHandler.listen();

  const game = new Game({ canvas, context, player, eventEmitter });

  //Start the game
  game.start();
};

window.onload = initializeApp;
