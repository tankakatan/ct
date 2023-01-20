import jimp, {
    RESIZE_BEZIER,
    RESIZE_BICUBIC,
    RESIZE_BILINEAR,
    RESIZE_HERMITE,
    RESIZE_NEAREST_NEIGHBOR
} from 'jimp';

export type ResizeType =
    typeof RESIZE_BEZIER |
    typeof RESIZE_BICUBIC |
    typeof RESIZE_BILINEAR |
    typeof RESIZE_HERMITE |
    typeof RESIZE_NEAREST_NEIGHBOR;

export type BitmapOpts = {
    resize?: {w?: number, h?: number, mode?: ResizeType};
    raw?: boolean;
};

export const bitmap = async (input: Buffer, {resize = {}, raw}: BitmapOpts = {}) => {
    try {
        let image = await jimp.read(input);
        if (resize) {
            image = image.resize(resize.w || jimp.AUTO, resize.h || jimp.AUTO, resize.mode);
        }
        image = image.grayscale();
        return raw ? image.bitmap.data : await image.getBufferAsync(jimp.MIME_BMP);
    } catch (e) {
        console.log('Bitmap error:', e);
        throw e;
    }
};
