import React from 'react';
import {ProvideAppContext, useAppContext} from './Context';

const App = () => {
  const {canvasSrc, canvasCns, canvasDpt, canvasPlt} = useAppContext();
  const hint = 'Your browser does not support HTML 5 canvas';
  return (
    <div>
      <canvas id='source' ref={canvasSrc}>{hint}</canvas>
      <canvas id='census' ref={canvasCns}>{hint}</canvas>
      <canvas id='depth' ref={canvasDpt}>{hint}</canvas>
      <canvas id='plot' ref={canvasPlt}>{hint}</canvas>
    </div>
  );
};

export default () => {
  return (<ProvideAppContext><App/></ProvideAppContext>);
};
