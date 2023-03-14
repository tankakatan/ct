export type DepthMapOpts = {
    bytesPerPixel?: number;
    width: number;
    height: number;
};

export default (
    i1: Uint8ClampedArray,
    i2: Uint8ClampedArray,
    {
        bytesPerPixel = 4,
        width,
        height,
    }: DepthMapOpts
) => {
    const map = [];

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const offset = i * width + j;
            const target = i1[offset * bytesPerPixel];

            let depth = 0;

            for (let k = 0; k < width - j; k++) {
                if (target === i2[(offset + k) * bytesPerPixel]) {
                    break;
                }

                depth++;
            }

            map.push(depth);
        }
    }

    return map;
};
