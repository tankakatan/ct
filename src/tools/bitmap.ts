export type ImageDataToBitmapConfig = {
  pixelSize?: number;
  mapping?: (values: number[]) => number;
};

export function imageDataToBitmap(img: ImageData, { pixelSize = 4, mapping }: ImageDataToBitmapConfig = {}) {
  const bitmap = [];
  for (let i = 0; i < img.data.length; i += pixelSize) {
    if (typeof mapping === 'function') {
      const args = [];
      for (let j = 0; j < pixelSize; j++) {
        args.push(img.data[i + j]);
      }
      bitmap.push(mapping(args));
    } else {
      bitmap.push(img.data[i]);
    }
  }
  return bitmap;
}

export type BitmapConfigToImageData = {
  pixelSize?: number;
  mapping?: (value: number, pixelSize: number, width: number) => number[];
  rescaler?: (value: number, width: number, pixelSize: number) => number;
};

export function bitmapToImageData(bitmap: number[], width: number, { pixelSize = 4, mapping, rescaler }: BitmapConfigToImageData = {}) {
  const imageData = [];
  for (let i = 0; i < bitmap.length; i++) {
    if (typeof mapping === 'function') {
      const pixel = mapping(bitmap[i], pixelSize, width);
      for (let j = 0; j < pixelSize; j++) {
        imageData.push(pixel[j]);
      }
    } else {
      const value = typeof rescaler === 'function' ? rescaler(bitmap[i], width, pixelSize) : bitmap[i];
      imageData.push(value, value, value, 255);
    }
  }
  return new ImageData(new Uint8ClampedArray(imageData), width);
}
