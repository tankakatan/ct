export type InputBitmapOpts = {
    bytesPerPixel?: number;
    width: number;
    height: number;
    binary?: boolean;
};

export default (
    bitmap: Buffer,
    {
        bytesPerPixel = 4,
        width,
        height,
        binary = false,
    }: InputBitmapOpts
) => {
    const xi = (i1: number, i2: number) => (
        bitmap[i1 * bytesPerPixel] <= bitmap[i2 * bytesPerPixel]
    );

    const transform = [];

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const offset = i * width + j;

            const firstRow = i === 0;
            const firstCol = j === 0;
            const lastRow = i === height - 1;
            const lastCol = j === width - 1;

            let byte = 0;

            byte |= +(firstCol || firstRow || xi(offset, offset - width - 1)); byte <<= 1;
            byte |= +(            firstRow || xi(offset, offset - width    )); byte <<= 1;
            byte |= +(lastCol  || firstRow || xi(offset, offset - width + 1)); byte <<= 1;
            byte |= +(firstCol             || xi(offset, offset         - 1)); byte <<= 1;
            byte |= +(lastCol              || xi(offset, offset         + 1)); byte <<= 1;
            byte |= +(firstCol || lastRow  || xi(offset, offset + width - 1)); byte <<= 1;
            byte |= +(            lastRow  || xi(offset, offset + width    )); byte <<= 1;
            byte |= +(lastCol  || lastRow  || xi(offset, offset + width + 1));

            if (binary) {
                byte = byte > 127 ? 255 : 0;
            }

            transform.push(byte, byte, byte, 255);
        }
    }

    return Buffer.from(transform);
};