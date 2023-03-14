import {resolve} from 'path';
import Jimp from './ext';

const [,, filename1, filename2] = process.argv;

if (!filename1 || !filename2) {
    throw new Error('Please specify exactly 2 filenames to compute a depth map from');
}

(async () => {
    try {
        const path1 = resolve(__dirname, '..', filename1);
        const path2 = resolve(__dirname, '..', filename2);

        const image1 = await Jimp.read(path1);
        const image2 = await Jimp.read(path2);

        const depthMap = image1.depthMap(image2);
        const {width, height} = image1.bitmap;

        for (let i = 0; i < height; i++) {
            console.info(depthMap.slice(i * width, i * width + width).join(''));
        }

    } catch (e) {
        console.error('Depth Map error:', e);
    } finally {
        return;
    }
})();

