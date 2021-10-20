export class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  }

  subtract(point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  }

  reduce(value) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  collide(point, width, height) {
    return (
      this.x >= point.x &&
      this.x <= point.x + width &&
      this.y >= point.y &&
      this.y < point.y + height
    );
  }

  clone() {
    return new Point(this.x, this.y);
  }
}
