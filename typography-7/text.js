import { pointCircle } from "./utils.js";

export class Text {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  setText(str, density, stageWidth, stageHeight) {
    this.canvas.width = stageWidth;
    this.canvas.height = stageHeight;

    const myText = str;
    const fontWidth = 700;
    const fontSize = 800;
    const fontName = "Hind";

    this.ctx.clearRect(0, 0, stageWidth, stageHeight);
    this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    this.ctx.textBaseline = "middle";

    const fontPos = this.ctx.measureText(myText);
    this.ctx.fillText(
      myText,
      (stageWidth - fontPos.width) / 2,
      fontPos.actualBoundingBoxAscent +
        fontPos.actualBoundingBoxDescent +
        (stageHeight - fontSize) / 2
    );

    return this.dotPos(density, stageWidth, stageHeight);
  }

  dotPos(density, stageWidth, stageHeight) {
    const imageData = this.ctx.getImageData(0, 0, stageWidth, stageHeight).data;

    const particles = [];
    let i = 0;
    let width = 0;
    let pixel;

    for (let height = 0; height < stageHeight; height += density) {
      ++i;
      const slide = i % 2 == 0;
      width = 0;

      if (slide == 1) {
        width += 6;
      }

      for (; width < stageWidth; width += density) {
        pixel = imageData[(width + height * stageWidth) * 4 - 1];
        if (
          pixel != 0 &&
          width > 0 &&
          width < stageWidth &&
          height > 0 &&
          height < stageHeight
        ) {
          particles.push({ x: width, y: height });
        }
      }
    }

    return this.getOutline(particles, density);
  }

  getOutline(particles, density) {
    let minX = particles[0].x;
    let maxX = particles[0].x;
    let minY = particles[0].y;
    let maxY = particles[0].y;

    for (let i = 1; i < particles.length; i++) {
      const item = particles[i];
      minX = Math.min(minX, item.x);
      maxX = Math.max(maxX, item.x);
      minY = Math.min(minY, item.y);
      maxY = Math.max(maxY, item.y);
    }

    const gap = density * 2;
    const distX = maxX - minX;
    const xTotal = (distX / gap) | 0;
    const distY = maxY - minY;
    const yTotal = (distY / gap) | 0;

    const outline = [];
    const xArray = [];
    for (let i = 0; i < xTotal; i++) {
      const tx = minX + i * gap;
      xArray[i] = [];

      for (let j = 0; j < yTotal; j++) {
        const ty = minY + j * gap;

        for (let k = 0; k < particles.length; k++) {
          const item = particles[k];
          if (pointCircle(item.x, item.y, tx, ty, gap)) {
            xArray[i].push({
              x: tx,
              item,
            });
          }
        }
      }
    }

    let check = 0;
    let prevY;
    for (let i = 0; i < xArray.length; i++) {
      check = 0;

      for (let j = 0; j < xArray[i].length; j++) {
        const pos = xArray[i][j];

        if (check == 0) {
          prevY = pos.item.y;
          outline.push({
            x: pos.x,
            minY: pos.item.y,
            maxY: pos.item.y,
          });

          check = 1;
        } else if (check == 1) {
          if (pointCircle(pos.x, pos.item.y, pos.x, prevY, gap)) {
            const cur = outline[outline.length - 1];
            cur.minY = Math.min(cur.minY, pos.item.y);
            cur.maxY = Math.max(cur.maxY, pos.item.y);
            check = 1;
            prevY = pos.item.y;
          } else {
            check = 2;
          }
        } else if (check == 2) {
          prevY = pos.item.y;
          outline.push({
            x: pos.x,
            minY: pos.item.y,
            maxY: pos.item.y,
          });
          check = 1;
        }
      }
    }

    return {
      particles,
      minX,
      maxX,
      minY,
      maxY,
      outline,
    };
  }
}
