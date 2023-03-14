import React, {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useState,
    useEffect,
    useRef,
    Ref,
    useCallback,
} from 'react';

import {ct, dm, rescale} from '../../tools';
// import sourceImage from '../../../assets/Glasses_800_edit.png';
import sourceImage1 from '../../../assets/dm-test-01.gif';
import sourceImage2 from '../../../assets/dm-test-02.gif';

const AppContext = createContext({
    canvasSrc: null as Ref<HTMLCanvasElement>,
    canvasCns: null as Ref<HTMLCanvasElement>,
    canvasDpt: null as Ref<HTMLCanvasElement>,
    canvasPlt: null as Ref<HTMLCanvasElement>,
});

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext: FC<PropsWithChildren> = ({children}) => {
    // const [src, setSrc] = useState(sourceImage);
    const imgSrc = useRef<HTMLImageElement>(new Image());
    const canvasSrc = useRef<HTMLCanvasElement>(null);
    const canvasCns = useRef<HTMLCanvasElement>(null);
    const canvasDpt = useRef<HTMLCanvasElement>(null);
    const canvasPlt = useRef<HTMLCanvasElement>(null);

    const fitIntoScreen = useCallback(() => {
        const canvases = [canvasSrc, canvasCns, canvasDpt, canvasPlt];
        for (const canvas of canvases) {
            if (canvas && canvas.current) {
                canvas.current.height = Math.floor(window.innerHeight / 2);
                canvas.current.width = Math.floor(window.innerWidth / 2);
            }
        }
    }, []);

    const drawImageInCanvas = useCallback((
        image: HTMLImageElement,
        canvas: HTMLCanvasElement,
    ) => {
        const isVertical = image.height > image.width;
        const verticalRatio = isVertical ? 1 : (image.height / image.width);
        const horizontalRatio = isVertical ? (image.width / image.height) : 1;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        ctx.drawImage(image, 0, 0,
            isVertical ? canvas.width : canvas.width * verticalRatio,
            isVertical ? canvas.height * horizontalRatio : canvas.height,
        );

        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }, []);

    useEffect(() => {
        fitIntoScreen();
        window.onresize = () => {
            fitIntoScreen();
            // if (imgSrc && canvasSrc && canvasSrc.current) {
            //     drawImageInCanvas(imgSrc.current, canvasSrc.current);
            // }
        };
    }, [imgSrc]);

    useEffect(() => {
        imgSrc.current.src = sourceImage1;
        imgSrc.current.onload = async () => {
            if (!(canvasSrc && canvasSrc.current)) {
                return;
            }

            // const srcData = drawImageInCanvas(imgSrc.current, canvasSrc.current);

            const ctxSrc = canvasSrc.current.getContext('2d');
            if (!ctxSrc) {
                return;
            }

            ctxSrc.drawImage(imgSrc.current, 0, 0);
            const imgSrc2: HTMLImageElement = await (() => {
                const imgSrc2 = new Image();
                imgSrc2.src = sourceImage2;
                return new Promise((resolve) => {
                    imgSrc2.onload = () => resolve(imgSrc2)
                });
            })();

            ctxSrc.drawImage(imgSrc2, imgSrc.current.width, 0);

            const srcData = ctxSrc.getImageData(0, 0,
                imgSrc.current.width + imgSrc2.width,
                Math.max(imgSrc.current.height, imgSrc2.height),
            );

            if (!srcData || !canvasCns || !canvasCns.current) {
                return;
            }

            const ctxCns = canvasCns.current.getContext('2d');
            if (!ctxCns) {
                return;
            }

            const {width, height, data} = srcData;
            const cnsData = new ImageData(ct(data, {width, height}), width, height);
            ctxCns.putImageData(cnsData, 0, 0);

            if (!(canvasDpt && canvasDpt.current)) {
                return;
            }

            const depthMap = dm(
                ctxCns.getImageData(0, 0, Math.floor(width / 2), height).data,
                ctxCns.getImageData(Math.floor(width / 1) + 1, 0, Math.floor(width / 2), height).data,
                {height, width: Math.floor(width / 2)}
            );
            let maxDepth = 0;
            for (let i = 0; i < depthMap.length; i++) {
                maxDepth = Math.max(maxDepth, depthMap[i]);
            }

            const depthMapData = [];
            for (let i = 0; i < depthMap.length; i++) {
                const pixel = rescale(depthMap[i], 0, maxDepth, 255, 0);
                depthMapData.push(pixel, pixel, pixel, 255);
            }

            const dptData = new ImageData(
                new Uint8ClampedArray(depthMapData), Math.floor(width/2), height
            );

            const ctxDpt = canvasDpt.current.getContext('2d');
            if (!ctxDpt) {
                return;
            }

            ctxDpt.putImageData(dptData, 0, 0);
        };
    }, []);

    const value = {
        canvasSrc,
        canvasCns,
        canvasDpt,
        canvasPlt,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
