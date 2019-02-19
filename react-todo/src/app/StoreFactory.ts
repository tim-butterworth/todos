import {
    Store
    , createStore
    , applyMiddleware
} from 'redux';

import { ReducerFactory, MiddlewareFactory } from './AppFactory';
import { AppState } from './AppState';

const storeFactory = (
    reducerFactory: ReducerFactory<AppState>,
    middlewareFactory: MiddlewareFactory<AppState>
): Store<AppState> => createStore(
    reducerFactory(),
    applyMiddleware(middlewareFactory())
);

export { storeFactory };
