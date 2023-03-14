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

import ct from '../../census-transform';
import sourceImage from '../../../assets/Glasses_800_edit.png';

const AppContext = createContext({
    canvasSrc: null as Ref<HTMLCanvasElement>,
    canvasCns: null as Ref<HTMLCanvasElement>,
    canvasDpt: null as Ref<HTMLCanvasElement>,
    canvasPlt: null as Ref<HTMLCanvasElement>,
});

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext: FC<PropsWithChildren> = ({children}) => {
    const [src, setSrc] = useState(sourceImage);
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
            if (imgSrc && canvasSrc && canvasSrc.current) {
                drawImageInCanvas(imgSrc.current, canvasSrc.current);
            }
        };
    }, [imgSrc]);

    useEffect(() => {
        imgSrc.current.src = src;
        imgSrc.current.onload = async () => {
            if (!(canvasSrc && canvasSrc.current)) {
                return;
            }

            const srcData = drawImageInCanvas(imgSrc.current, canvasSrc.current);
            if (!srcData || !canvasCns || !canvasCns.current) {
                return;
            }

            const ctx = canvasCns.current.getContext('2d');
            if (!ctx) {
                return;
            }

            const {width, height, data} = srcData;
            ctx.putImageData(new ImageData(ct(data, {width, height}), width, height), 0, 0);
        };
    }, [src]);

    const value = {
        canvasSrc,
        canvasCns,
        canvasDpt,
        canvasPlt,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
