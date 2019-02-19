import React, { Component, ReactNode } from 'react';
import logo from './logo.svg';
import './App.css';

import { Provider } from 'react-redux';

import { ListComponent } from './todo/list/listComponent';
import { AddToDoComponent } from './todo/add/addToDoComponent';
import {
    StoreFactory
    , ReducerFactory
    , MiddlewareFactory
    , AppFactory
} from './app/AppFactory';
import { AppState } from './app/AppState';

const app = (
    storeFactory: StoreFactory,
    reducerFactory: ReducerFactory<AppState>,
    middlewareFactory: MiddlewareFactory<AppState>
): typeof Component => {
    return class App extends Component<{}, {}> {

        render(): ReactNode {
            return (
                <Provider store={storeFactory(reducerFactory, middlewareFactory)}>
                    <div className="App">
                        <AddToDoComponent />
                        <ListComponent />
                    </div>
                </Provider>
            );
        }
    };
}

export { app };
