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
} from "react";

import { censusTransform, depthMap, rescale, imageDataToBitmap, bitmapToImageData } from "../../tools";
// import sourceImage from '../../../assets/Glasses_800_edit.png';
// import sourceImage1 from '../../../assets/dm-test-01.gif';
// import sourceImage2 from '../../../assets/dm-test-02.gif';
// import sourceImage from '../../../assets/stereo-test-01.png';
// import sourceImage from '../../../assets/passiflora.jpeg';
import sourceImage from "../../../assets/sample.png";

const AppContext = createContext({
  canvasSrc: null as Ref<HTMLCanvasElement>,
  canvasCns: null as Ref<HTMLCanvasElement>,
  canvasDpt: null as Ref<HTMLCanvasElement>,
  canvasPlt: null as Ref<HTMLCanvasElement>,
});

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext: FC<PropsWithChildren> = ({ children }) => {
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

  useEffect(() => {
    fitIntoScreen();
    window.onresize = fitIntoScreen;
    return () => window.removeEventListener('resize', fitIntoScreen);
  }, []);

  useEffect(() => {
    imgSrc.current.src = sourceImage;
    imgSrc.current.onload = async () => {
      if (!canvasSrc || !canvasSrc.current) {
        return;
      }

      const ctxSrc = canvasSrc.current.getContext("2d")!;

      ctxSrc.drawImage(imgSrc.current, 0, 0, imgSrc.current.width, imgSrc.current.height, 0, 0, canvasSrc.current.width, canvasSrc.current.height);

      const width = Math.floor(canvasSrc.current.width / 2);
      const height = imgSrc.current.height;
      const srcData = ctxSrc.getImageData(0, 0, width * 2, height)!;
      const srcBitmap = imageDataToBitmap(srcData);

      const ctxCns = canvasCns.current!.getContext("2d")!;
      const censusBitmap = censusTransform(srcBitmap, {
        width: width * 2,
        height,
        rescaler: (b: number) => b > 127 ? 255 : 0
      });

      const censusImage = bitmapToImageData(censusBitmap, width * 2);

      ctxCns.putImageData(censusImage, 0, 0);

      const leftBitmap: number[] = [];
      const rightBitmap: number[] = [];

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          const src = i * width * 2 + j;
          const dst = i * width + j;
          leftBitmap[dst] = censusBitmap[src];
        }
        for (let k = width; k < width * 2; k++) {
          const src = i * width * 2 + k;
          const dst = i * width + k % width;
          rightBitmap[dst] = censusBitmap[src];
        }
      }

      const depthBitmap = depthMap(leftBitmap, rightBitmap, { height, width });

      let maxDepth = 0;
      for (const b of depthBitmap) {
        maxDepth = Math.max(maxDepth, b);
      }
      const ctxDpt = canvasDpt.current!.getContext("2d")!;
      const depthImage = bitmapToImageData(depthBitmap, width, {
        mapping: (x) => {
          x = 5 * x;
          const avg = maxDepth / 2;
          const r = rescale(x, 0, maxDepth, 0, 255);
          const g = rescale(Math.abs(avg - x), 0, avg, 255, 0);
          const b = rescale(x, 0, maxDepth, 255, 0);
          return [r, g, b, 255];
        },
      });

      ctxDpt.putImageData(depthImage, 0, 0);
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
