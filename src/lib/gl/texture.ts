export const generateTextureAtlas = (items: { width: number, height: number, image: HTMLImageElement }[], width: number, height: number, padding = 8) => {
  const offscreen = new OffscreenCanvas(width, height);
  const context = offscreen.getContext("2d")!;
  let aabbs: { x1: number; x2: number; y1: number; y2: number }[] = [];
  const getAABB = (
    width: number,
    height: number,
    x = 0,
    y = 0
  ): { x1: number; x2: number; y1: number; y2: number } => {
    const x1 = x;
    const x2 = x1 + width + padding * 2;
    const y1 = y;
    const y2 = y1 + height + padding * 2;
    if (x2 > offscreen.width) {
      for (const aabb of aabbs) {
        if (width >= aabb.y1 && y2 >= aabb.y1 && y1 < aabb.y2) {
          return getAABB(width, height, 0, aabb.y2);
        }
      }
      return getAABB(width, height, 0, y + 1);
    }
    if (y2 > offscreen.height) {
      throw new RangeError("Out of Range");
    }
    for (const aabb of aabbs) {
      if (x2 >= aabb.x1 && x1 < aabb.x2 && y2 >= aabb.y1 && y1 < aabb.y2) {
        return getAABB(width, height, aabb.x2, y);
      }
    }
    return { x1, x2, y1, y2 };
  };
  const uvs = items.map(item => {
    const aabb = getAABB(item.width, item.height);
    aabbs.push(aabb);
    const x1 = (aabb.x1 + padding) / offscreen.width;
    const y1 = (aabb.y1 + padding) / offscreen.height;
    const x2 = (aabb.x2 - padding) / offscreen.width;
    const y2 = (aabb.y2 - padding) / offscreen.height;
    context.drawImage(
      item.image,
      aabb.x1 + padding,
      aabb.y1 + padding,
      item.width,
      item.height
    );
    return [x2, y2, x1, y2, x1, y1, x2, y1]
  });
  const bitmap = offscreen.transferToImageBitmap();
  return {
    bitmap,
    uvs,
  };
}