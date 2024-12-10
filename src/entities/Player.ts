import { EventEmitter } from "../core/EventEmitter";
import { CONFIG } from "../utils/Config";
import { EVENT_TYPES } from "../utils/Constants";
import { loadImage } from "../utils/Image";

export type Direction = "left" | "right";

export class Player {
  private x: number;
  private y: number;
  private width: number = CONFIG.PLAYER_WIDTH;
  private height: number = CONFIG.PLAYER_HEIGHT;
  private image: HTMLImageElement | null = null;
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.x = CONFIG.CANVAS_WIDTH / 2 - this.width / 2;
    this.y = CONFIG.CANVAS_HEIGHT - this.height;
    this.eventEmitter = eventEmitter;

    eventEmitter.on(EVENT_TYPES.PLAYER_MOVE, this.move.bind(this));
    eventEmitter.on(EVENT_TYPES.INPUT_SHOOT, this.shoot.bind(this));

    this.loadPlayerImage();
  }

  async loadPlayerImage() {
    try {
      const playerImage = await loadImage("src/assets/spaceship.png");
      this.image = playerImage;
    } catch (error: any) {
      this.image = null;
    }
  }

  move(direction: Direction) {
    if (direction === "left") {
      this.x -= CONFIG.PLAYER_SPEED;
    } else if (direction === "right") {
      this.x += CONFIG.PLAYER_SPEED;
    }
    this.x = Math.max(0, Math.min(this.x, CONFIG.CANVAS_WIDTH - this.width));
  }

  shoot() {
    const bulletX = this.x + this.width / 2 - CONFIG.PROJECTILE_WIDTH / 2;
    const bulletY = this.y;
    this.eventEmitter.emit(EVENT_TYPES.PLAYER_SHOOT, {
      x: bulletX,
      y: bulletY,
    });
  }

  async render(context: CanvasRenderingContext2D) {
    if (this.image) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
