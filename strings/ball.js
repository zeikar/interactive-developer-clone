const PI2 = Math.PI * 2;

export class Ball {
  constructor(stageWidth, stageHeight, radius, speed) {
    this.radius = radius;
    this.vx = speed;
    this.vy = speed;
    this.x = stageWidth / 2;
    this.y = stageHeight / 2;
  }

  animate(ctx, stageWidth, stageHeight) {
    this.x += this.vx;
    this.y += this.vy;

    const minX = this.radius;
    const maxX = stageWidth - this.radius;
    const minY = this.radius;
    const maxY = stageHeight - this.radius;

    if (this.x <= minX || this.x >= maxX) {
      this.vx *= -1;
    }

    if (this.y <= minY || this.y >= maxY) {
      this.vy *= -1;
    }

    ctx.fillStyle = "#ffdd1c";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2);
    ctx.fill();
  }
}
