import { EventEmitter } from "../core/EventEmitter";
import { EVENT_TYPES } from "../utils/Constants";

export class InputHandler {
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  listen() {
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      const { key } = event;

      switch (key) {
        case "ArrowRight":
          this.eventEmitter.emit(EVENT_TYPES.PLAYER_MOVE, "right");
          break;

        case "ArrowLeft":
          this.eventEmitter.emit(EVENT_TYPES.PLAYER_MOVE, "left");
          break;

        case " ":
          this.eventEmitter.emit(EVENT_TYPES.INPUT_SHOOT);
          break;

        default:
          break;
      }
    });
  }
}
