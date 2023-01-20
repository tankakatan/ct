import {resolve} from 'path';
import {promises as fsPromises} from 'fs';

import {bitmap} from './bitmap';
import ct from './census-transform';

const {readFile, writeFile, stat} = fsPromises;
const [,, filename] = process.argv;

if (!filename) {
    throw new Error('Please specify a filename to conver');
}

(async () => {
    const path = resolve(__dirname, '..', filename);

    try {
        await stat(path);
    } catch (e) {
        console.error(`File "${path}" does not exists`, e);
        throw e;
    }

    let input;
    try {
        input = await readFile(path);
    } catch (e) {
        console.error('Conver error:', e);
        throw e;
    }

    const bmp = await bitmap(input, {resize: {w: 100}, raw: true});
    const h = bmp.length / (100 * 4);
    const transform = ct(bmp, {bytesPerPixel: 4, w: 100, h})

    console.log({
        h,
        bmp: bmp.length / 4,
        transform: transform.length
    });

    console.log(transform.join(', '));

    // console.info('Successfully converted', bmp.length);

    // const bytes = [];

    // for (const byte of bmp.slice(0, 100)) {
    //     bytes.push(Number(byte));
    // }

    // console.info(bytes.join(','));
    // console.info(bmp.slice(0, 100).toString('hex'));

    try {
        await writeFile(resolve(__dirname, '..', 'assets', 'test.bmp'), bmp, 'binary');
        console.info('Successfully writen to file');
    } catch (e) {
        console.error('Write error:', e);
    }

    return;
})();

