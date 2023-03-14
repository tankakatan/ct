import React from 'react';
import ReactDom from 'react-dom/client';
import {App} from './components';

import './index.css';

ReactDom
    .createRoot(document.getElementById('app') as Element)
    .render(<App/>);
