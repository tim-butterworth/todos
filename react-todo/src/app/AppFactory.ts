import React from 'react';
import {
    Store
    , Reducer
    , Middleware
    , Dispatch
} from 'redux';
import { app } from '../App';
import { AppState } from './AppState';

export type ReducerFactory<T> = () => Reducer<T>;
export type MiddlewareFactory<T> = () => Middleware<any, T, Dispatch>;
export type StoreFactory = (
    reducerFactory: ReducerFactory<AppState>,
    middlewareFactory: MiddlewareFactory<AppState>
) => Store;

const AppFactory = (
    storeFactory: StoreFactory
    , reducerFactory: ReducerFactory<AppState>
    , middlewareFactory: MiddlewareFactory<AppState>
): typeof React.Component => app(storeFactory, reducerFactory, middlewareFactory);

export { AppFactory };
