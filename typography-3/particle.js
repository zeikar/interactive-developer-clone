import { RANDOM_TEXT } from "./visual.js";

const FRICTION = 0.86;
const COLOR_SPEED = 0.12;

export class Particle {
  constructor(pos) {
    this.savedX = pos.x;
    this.savedY = pos.y;
    this.x = pos.x;
    this.y = pos.y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 10;

    this.textArr = RANDOM_TEXT.split("");
    this.cur = 0;
    this.total = this.textArr.length;

    this.fps = 15;
    this.fpsTime = 1000 / this.fps;

    this.savedRgb = 0x000000;
    this.rgb = 0x000000;
  }

  collide() {
    this.rgb = 0xf3316e;
    this.textArr = this.shuffle(this.textArr);
  }

  draw(ctx, t) {
    this.rgb += (this.savedRgb - this.rgb) * COLOR_SPEED;

    if (!this.time) {
      this.time = t;
    }

    const now = t - this.time;
    if (now > this.fpsTime) {
      this.time = t;
      this.cur++;
      if (this.cur >= this.total) {
        this.cur = 0;
      }
    }

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;

    const red = ((this.rgb >> 16) & 0xff) | 0;
    const green = ((this.rgb >> 8) & 0xff) | 0;
    const blue = (this.rgb & 0xff) | 0;
    const color = `rgb(${red}, ${green}, ${blue})`;

    const str = this.textArr[this.cur];

    ctx.beginPath();
    ctx.fillStyle = color;

    const fontWidth = 700;
    const fontSize = 14;
    const fontName = "Hind";
    ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
    ctx.textBaseline = "middle";

    const textPos = ctx.measureText(str);
    ctx.fillText(
      str,
      this.x - textPos.width / 2,
      this.y + (fontSize - textPos.actualBoundingBoxAscent) / 2
    );
  }

  shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
}
