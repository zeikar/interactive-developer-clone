export async function setColor(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = image.width;
      tmpCanvas.height = image.height;
      const tmpCtx = tmpCanvas.getContext("2d");

      tmpCtx.drawImage(image, 0, 0, image.width, image.height);

      resolve({
        colorCtx: tmpCtx,
        width: image.width,
        height: image.height,
      });
    };
  });
}
