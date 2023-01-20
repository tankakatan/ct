export type InputBitmapOpts = {
    bytesPerPixel?: number;
    w: number;
    h: number;
};

export default (bitmap: Buffer, {bytesPerPixel = 4, w, h}: InputBitmapOpts) => {
    const xi = (i1: number, i2: number) => (
        Number(bitmap[i1 * bytesPerPixel] <= bitmap[i2 * bytesPerPixel])
    );

    const transform = [];

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            const offset = i * w + j;
            const firstRow = i === 0;
            const firstCol = j === 0;
            const lastRow = i === h - 1;
            const lastCol = j === w - 1;
            const vector = [
                +(firstCol || firstRow) || xi(offset, offset - w - 1),
                +(            firstRow) || xi(offset, offset - w),
                +(lastCol  || firstRow) || xi(offset, offset - w + 1),

                +(firstCol            ) || xi(offset, offset - 1),
                +(lastCol             ) || xi(offset, offset + 1),

                +(firstCol || lastRow ) || xi(offset, offset + w - 1),
                +(            lastRow ) || xi(offset, offset + w),
                +(lastCol  || lastRow ) || xi(offset, offset + w + 1),
            ];

            transform.push(vector.join(''));
        }
    }

    return transform;
};