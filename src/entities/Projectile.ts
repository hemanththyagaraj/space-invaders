import { CONFIG } from "../utils/Config";
import { loadImage } from "../utils/Image";

export class Projectile {
  private x: number;
  private y: number;
  private width: number = CONFIG.PROJECTILE_WIDTH;
  private height: number = CONFIG.PROJECTILE_HEIGHT;
  private speed: number = CONFIG.PROJECTILE_SPEED;
  private image: HTMLImageElement | null = null;
  private hit: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.loadProjectileImage();
  }

  async loadProjectileImage() {
    try {
      const projectileImage = await loadImage("src/assets/bullet.png");
      this.image = projectileImage;
    } catch (error) {
      this.image = null;
    }
  }

  markAsHit() {
    this.hit = true;
  }

  isHit() {
    return this.hit;
  }

  update(): boolean {
    this.y -= this.speed;
    return this.y + this.height > 0;
  }

  render(context: CanvasRenderingContext2D) {
    if (this.image) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
