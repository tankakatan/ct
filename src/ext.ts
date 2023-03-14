import Jimp from 'jimp';

import ct from './census-transform';
import dm from './depth-map';

declare module '@jimp/core' {
    interface Jimp {
        censusTransform(_?: CensusTransformOpts): Jimp;
        depthMap(image: Jimp): number[];
    }
};

export type CensusTransformOpts = {
    binary?: boolean;
};

Jimp.prototype.censusTransform = function({binary = false}: CensusTransformOpts = {}) {
    const {bitmap: {data, width, height}} = this.greyscale();
    return new Jimp({
        data: ct(data, {
            bytesPerPixel: 4,
            width,
            height
        }),
        width,
        height,
        binary,
    });
};

Jimp.prototype.depthMap = function(image: Jimp) {
    const {bitmap: {data, width, height}} = this;
    return dm(data, image.bitmap.data, {bytesPerPixel: 4, width, height});
};

export default Jimp;
