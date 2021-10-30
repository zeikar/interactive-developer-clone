import { Particle } from "./particle.js";
import { distance, pointCircle } from "./utils.js";

const DEFAULT_ANGLE = (90 * Math.PI) / 180;
const GRAVITY = 0.3;
const VERTICAL_RATE = 0.3;
const MOUSE_PULL_RATE = 0.1;
const FRICTION = 0.97;
const MOUSE_MOVE_FRICTION = 0.7;

export class ParticleGroup {
  constructor(pos, groupRatio, texture, lineTotal) {
    this.particles = [];

    for (let i = 0; i < lineTotal; i++) {
      const item = new Particle(pos, groupRatio, i / lineTotal, texture);
      this.particles.push(item);
    }
  }

  animate(mouse) {
    const total = this.particles.length;

    for (let i = 0; i < total; i++) {
      const item = this.particles[i];
      item.vy += GRAVITY;

      if (pointCircle(item.x, item.y, mouse.x, mouse.y, 80)) {
        const pos = this.getPullPos(item.x, item.y, mouse.x, mouse.y);
        item.vx += pos.x;
        item.vy += pos.y;
        item.vx *= MOUSE_MOVE_FRICTION;
        item.vy *= MOUSE_MOVE_FRICTION;
      }

      if (i < total - 1) {
        const next = this.particles[i + 1];
        this.setAngle(item, next, 0);
        this.setAngle(next, item, Math.PI);
      }

      item.vx *= FRICTION;
      item.vy *= FRICTION;

      item.animate(i, total - 1);
    }
  }

  getPullPos(x1, y1, x2, y2) {
    const dist = distance(x1, y1, x2, y2);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const x = Math.cos(angle) * dist * MOUSE_PULL_RATE;
    const y = Math.sin(angle) * dist * MOUSE_PULL_RATE;
    return {
      x,
      y,
    };
  }

  setAngle(item1, item2, connectAngle) {
    const angle = connectAngle - DEFAULT_ANGLE;
    const tx = item1.x + Math.cos(angle);
    const ty = item1.y + Math.sin(angle);
    const vx = (item2.x - tx) * VERTICAL_RATE;
    const vy = (item2.y - ty) * VERTICAL_RATE;
    item1.vx += vx;
    item1.vy += vy;
    item2.vx -= vx;
    item2.vy -= vy;
  }
}
