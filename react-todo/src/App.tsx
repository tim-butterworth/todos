import React, { Component, ReactNode } from 'react';
import { ListComponent } from './todo/list/listComponent';
import logo from './logo.svg';
import './App.css';

import { Provider } from 'react-redux';

import {
    StoreFactory
    , ReducerFactory
} from './app/AppFactory';

interface AppProps {
    count: number;
    text: string;
}

const app = (storeFactory: StoreFactory, reducerFactory: ReducerFactory): typeof Component => {
    return class App extends Component<{}, AppProps> {

        constructor(props: {} = {}) {
            super(props);

            this.state = { count: 2, text: "default text" }
        }

        render(): ReactNode {
            return (
                <Provider store={storeFactory(reducerFactory)}>
                    <div className="App">
                        <div className="title">{this.state.text}</div>
                        <div>
                            <ListComponent />
                        </div>
                    </div>
                </Provider>
            );
        }

    };
}

export { app };
