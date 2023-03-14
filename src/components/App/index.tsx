import React from 'react';

import {ProvideAppContext} from './Context';
import sourceImage from '../../../assets/Glasses_800_edit.png';

const App = () => {
    return (
        <div>
            <img src={sourceImage} alt='Source Image'/>
            <canvas id='source'>Your browser does not support HTML 5 canvas</canvas>
            <canvas id='census'>Your browser does not support HTML 5 canvas</canvas>
            <canvas id='depth'>Your browser does not support HTML 5 canvas</canvas>
            <canvas id='plot'>Your browser does not support HTML 5 canvas</canvas>
        </div>
    );
};

export default () => {
    return (<ProvideAppContext><App/></ProvideAppContext>);
};
