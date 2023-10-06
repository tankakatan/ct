export type InputBitmapOpts = {
  bytesPerPixel?: number;
  rescaler?: (value: number) => number;
  width: number;
  height: number;
  binary?: boolean;
  threshold?: number;
};

export default function censusTransform(
  bitmap: number[],
  {
    width,
    height,
    rescaler,
  }: InputBitmapOpts
) {
  const xi = (i1: number, i2: number) => bitmap[i1] <= bitmap[i2];

  const transform = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const offset = i * width + j;

      const firstRow = i === 0;
      const firstCol = j === 0;
      const lastRow = i === height - 1;
      const lastCol = j === width - 1;

      let byte = 0;

      byte |= +(firstCol || firstRow || xi(offset, offset - width - 1));
      byte <<= 1;
      byte |= +(firstRow || xi(offset, offset - width));
      byte <<= 1;
      byte |= +(lastCol || firstRow || xi(offset, offset - width + 1));
      byte <<= 1;
      byte |= +(firstCol || xi(offset, offset - 1));
      byte <<= 1;
      byte |= +(lastCol || xi(offset, offset + 1));
      byte <<= 1;
      byte |= +(firstCol || lastRow || xi(offset, offset + width - 1));
      byte <<= 1;
      byte |= +(lastRow || xi(offset, offset + width));
      byte <<= 1;
      byte |= +(lastCol || lastRow || xi(offset, offset + width + 1));

      if (typeof rescaler === 'function') {
        byte = rescaler(byte);
      }

      transform.push(byte);
    }
  }

  return transform;
};
