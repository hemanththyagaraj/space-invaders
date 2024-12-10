import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { isColliding, Rect } from "../utils/Collision";
import { CONFIG } from "../utils/Config";
import { EVENT_TYPES } from "../utils/Constants";
import { EventEmitter } from "./EventEmitter";

interface GameDependencies {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  player: Player;
  eventEmitter: EventEmitter;
}

export class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private eventEmitter: EventEmitter;
  private player: Player;
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private running: Boolean;
  private lastFrameTime: number = performance.now();
  private score: number = 0;

  constructor({ canvas, context, player, eventEmitter }: GameDependencies) {
    this.canvas = canvas;
    this.context = context;
    this.player = player;
    this.eventEmitter = eventEmitter;
    this.running = false;

    //Listen to shoot events
    eventEmitter.on(EVENT_TYPES.PLAYER_SHOOT, this.addProjectiles.bind(this));

    //Listen to score update events
    eventEmitter.on(EVENT_TYPES.SCORE_UPDATE, this.updateScore.bind(this));

    this.spawnEnemies();
  }

  spawnEnemies() {
    //Calculate horizontal spacing
    const totalEnemyWidth = CONFIG.ENEMY_COLUMNS_COUNT * CONFIG.ENEMY_WIDTH;
    const remainingSpace = CONFIG.CANVAS_WIDTH - totalEnemyWidth;
    const horizontalSpacing = remainingSpace / (CONFIG.ENEMY_COLUMNS_COUNT + 1);

    for (let row = 0; row < CONFIG.ENEMY_ROWS_COUNT; row++) {
      for (let col = 0; col < CONFIG.ENEMY_COLUMNS_COUNT; col++) {
        const x = horizontalSpacing * (col + 1) + CONFIG.ENEMY_WIDTH * col;
        const y =
          CONFIG.VERTICAL_GAP_BETWEEN_ENEMIES * (row + 1) +
          CONFIG.ENEMY_HEIGHT * row;

        const enemy = new Enemy(x, y);
        this.enemies.push(enemy);
      }
    }
  }

  addProjectiles({ x, y }: { x: number; y: number }) {
    this.projectiles.push(new Projectile(x, y));
  }

  start() {
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
  }

  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private renderPlayer(): void {
    this.player.render(this.context);
  }

  private updateAndRenderProjectiles(): void {
    this.projectiles = this.projectiles.filter((projectile) => {
      const isVisible = projectile.update();
      if (isVisible) {
        projectile.render(this.context);
      }

      this.checkProjectileCollisions(projectile);

      return isVisible && !this.isProjectileHit(projectile);
    });
  }

  private checkProjectileCollisions(projectile: Projectile): void {
    this.enemies = this.enemies.filter((enemy) => {
      if (isColliding({ ...projectile } as Rect, { ...enemy } as Rect)) {
        projectile.markAsHit();
        enemy.destroy();
        this.eventEmitter.emit(EVENT_TYPES.SCORE_UPDATE, 20);
        return true; // Keep for explosion
      }
      return !enemy.shouldRemove(); // Remove after explosion
    });
  }

  private isProjectileHit(projectile: Projectile): boolean {
    return projectile.isHit();
  }

  private updateAndRenderEnemies(deltaTime: number): void {
    this.enemies = this.enemies.filter((enemy) => {
      enemy.update(deltaTime);
      enemy.render(this.context);
      return !enemy.shouldRemove();
    });
  }

  private updateScore(score: number) {
    this.score += score;
  }

  private displayScore() {
    this.context.fillStyle = "white";
    this.context.font = '20px "Press Start 2P"';
    this.context.fillText(
      `Score: ${this.score}`,
      CONFIG.CANVAS_WIDTH - 200,
      30
    );
  }

  private checkGameOver() {
    return this.enemies.some(
      (enemy) =>
        enemy.y + CONFIG.ENEMY_HEIGHT >
        CONFIG.CANVAS_HEIGHT - CONFIG.PLAYER_HEIGHT
    );
  }

  private endGame(playerWon: boolean): void {
    this.running = false;

    // Display message based on the outcome
    const message = playerWon ? "You Win!" : "Game Over";

    this.context.fillStyle = "white";
    this.context.font = '40px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.fillText(
      message,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  private checkWinCondition(): boolean {
    return this.enemies.length === 0;
  }

  loop() {
    if (!this.running) return;

    const isGameOver = this.checkGameOver();

    if (isGameOver) {
      this.endGame(false);
      return;
    }

    // Check for Win Condition
    if (this.checkWinCondition()) {
      this.endGame(true); // true indicates the player won
      return;
    }

    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.clearCanvas();

    // Render the player
    this.renderPlayer();

    //Render the enemies
    this.updateAndRenderEnemies(deltaTime);

    //Update and render all projectiles
    this.updateAndRenderProjectiles();

    //Display the updated score
    this.displayScore();

    requestAnimationFrame(() => this.loop());
  }
}
