import { CONFIG } from "../utils/Config";
import { loadImage } from "../utils/Image";

export class Enemy {
  public x: number;
  public y: number;
  private width: number = CONFIG.ENEMY_WIDTH;
  private height: number = CONFIG.ENEMY_HEIGHT;
  private speed: number = CONFIG.ENEMY_SPEED;
  private image: HTMLImageElement | null = null;
  private destroyImage: HTMLImageElement | null = null;
  private destroyedTime: number = 0;
  private explosionDuration: number = 200;
  private isDestroyed: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.loadEnemyImage();
    this.loadDestroyImage();
  }

  async loadEnemyImage() {
    try {
      const enemyImage = await loadImage("src/assets/ufo.png");
      this.image = enemyImage;
    } catch (error) {
      this.image = null;
    }
  }

  async loadDestroyImage() {
    try {
      const destroyImage = await loadImage("src/assets/explode.png");
      this.destroyImage = destroyImage;
    } catch (error) {
      this.destroyImage = null;
    }
  }

  update(deltaTime: number): void {
    if (this.isDestroyed) {
      this.destroyedTime += deltaTime;
      return;
    }
    // Move vertically
    this.y += this.speed;
  }

  render(context: CanvasRenderingContext2D) {
    if (this.isDestroyed && this.destroyImage) {
      return context.drawImage(
        this.destroyImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    if (this.image) {
      // Draw enemy image
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  destroy() {
    this.isDestroyed = true;
    this.destroyedTime = 0;
  }

  shouldRemove() {
    return this.isDestroyed && this.destroyedTime >= this.explosionDuration;
  }
}
