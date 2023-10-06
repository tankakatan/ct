export type DepthMapOpts = {
  bytesPerPixel?: number;
  threshold?: number;
  width: number;
  height: number;
};

export type Vector = {
  values: number[],
  size: number;
  equals(v: Vector): boolean;
}

function vector(
  bitmap: number[],
  from: number,
  size: number = 3,
): Vector {
  const values: number[] = bitmap.slice(from, from + size);
  return Object.assign({ values, size }, {
    equals(y: Vector) {
      if (y.size !== size) {
        return false;
      }
      for (let i = 0; i < values.length; i++) {
        if (values[i] !== y.values[i]) {
          return false;
        }
      }
      return true;
    },
  });
}

export default function depthMap(
  i1: number[],
  i2: number[],
  {
    threshold = 0.5,
    width,
    height,
  }: DepthMapOpts
) {
  const map = [];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const offset = (i * width) + j;
      const target = vector(i1, offset);
      const limit = Math.min(width - j, threshold ? width * threshold : width);

      let depth = 0;
      for (let k = 0; k < limit; k++) {
        const suitor = vector(i2, offset + k);
        if (target.equals(suitor)) {
          depth = k;
          break;
        }
      }

      map.push(depth);
    }
  } 

  return map;
};
