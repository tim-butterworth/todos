import React from 'react';
import { Store, Reducer } from 'redux';
import { app } from '../App';

export type ReducerFactory = () => Reducer;
export type StoreFactory = (reducerFactory: ReducerFactory) => Store;

const AppFactory = (
    storeFactory: StoreFactory
    , reducerFactory: ReducerFactory
): typeof React.Component => app(storeFactory, reducerFactory);

export { AppFactory };
