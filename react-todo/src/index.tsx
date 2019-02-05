import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { AppFactory } from './app/AppFactory';
import { reducerFactory } from './app/ReducerFactory';
import { storeFactory } from './app/StoreFactory';

const App = AppFactory(
    storeFactory
    , reducerFactory
);

ReactDOM.render(<App />, document.getElementById('root'));
