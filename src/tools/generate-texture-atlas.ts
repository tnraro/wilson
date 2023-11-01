import { fruitData } from "lib/fruit";
import { generateTextureAtlas } from "lib/gl/texture";

const promiseImage = (src: string, width: number, height: number) => new Promise<HTMLImageElement>((resolve) => {
  const image = new Image();
  image.src = src
  image.width = width
  image.height = height
  image.addEventListener("load", () => {
    resolve(image);
  }, { once: true });
})

const items = await Promise.all(Object.values(fruitData).map(x => {
  const size = x.radius * 2 * 100 * 1.1
  return promiseImage(x.image, size, size);
}));

const { bitmap, uvs } = generateTextureAtlas(items, 1024, 512, 4);

const canvas = document.createElement("canvas");
canvas.width = bitmap.width;
canvas.height = bitmap.height;
const context = canvas.getContext("bitmaprenderer")!;

context.transferFromImageBitmap(bitmap);

document.body.append(canvas);

console.log(JSON.stringify(uvs));