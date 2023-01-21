import Jimp from 'jimp';
import ct from './census-transform';

declare module '@jimp/core' {
    interface Jimp {
        censusTransform(): Jimp;
    }
}

Jimp.prototype.censusTransform = function() {
    const {bitmap: {data, width, height}} = this.greyscale();
    return new Jimp({data: ct(data, {bytesPerPixel: 4, width, height}), width, height});
}

export default Jimp;
