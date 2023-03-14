import {resolve} from 'path';
import Jimp from './ext';

const [,, filename, width, height] = process.argv;

if (!filename) {
    throw new Error('Please specify a filename to convert');
}

(async () => {
    try {
        const path = resolve(__dirname, '..', filename);
        let image = await Jimp.read(path);
        if (width || height) {
            image = image.resize(
                width && parseInt(width) || Jimp.AUTO,
                height && parseInt(height) || Jimp.AUTO,
            );
        }

        image.censusTransform({binary: true})
             .write(path.replace(/(\.[a-zA-Z0-9]+)$/, '-ct$1'));

    } catch (e) {
        console.error('Census Transform error:', e);
    } finally {
        return;
    }
})();

