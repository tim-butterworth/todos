import * as R from 'ramda';
import {
    createStore
    , combineReducers
    , Dispatch
    , Store
    , AnyAction
    , Reducer
    , MiddlewareAPI
} from 'redux';

import {
    ReducerFactory
    , MiddlewareFactory
    , StoreFactory
} from '../app/AppFactory';

import { AppState } from '../app/AppState';

const d: Dispatch = <T extends AnyAction>(action: T): T => action;

const getTestStore: StoreFactory = <T>(
    reducerFactory: ReducerFactory<T>,
    middlewareFactory: MiddlewareFactory<T>
): Store<T> => {

    const reducer: Reducer = reducerFactory();
    const initialState: T = reducer(undefined, { type: "UNDEFINED" });
    const storeState: {
        currentState: T;
        reducer: Reducer;
        subscribers: { [key: number]: () => void; };
        nextSubscriberId: number;
    } = {
        currentState: initialState,
        reducer,
        subscribers: {},
        nextSubscriberId: 0
    };

    const middleware = middlewareFactory();
    const dispatcher = <A extends AnyAction>(action: A) => {
        const dispatch: Dispatch = <T extends AnyAction>(a: T): T => dispatcher(a);
        const middlewareStore: MiddlewareAPI<Dispatch<AnyAction>, T> = {
            getState: () => storeState.currentState,
            dispatch
        };
        const reducerDispatch = (a: AnyAction) => {
            const getState = () => storeState.currentState;
            const updatedState = reducer(getState(), a);

            storeState.currentState = updatedState;

            return updatedState;
        };

        const updatedStore = middleware(middlewareStore)(reducerDispatch)(action);
        storeState.currentState = updatedStore;

        R.forEach((l) => l(), R.values(storeState.subscribers));

        return action;
    }

    return {
        dispatch: dispatcher,
        getState: (): T => {
            return storeState.currentState;
        },
        subscribe: (listener: () => void) => {
            const removalId = storeState.nextSubscriberId;
            storeState.subscribers[storeState.nextSubscriberId] = listener;
            storeState.nextSubscriberId = storeState.nextSubscriberId + 1;

            return () => { delete storeState.subscribers[removalId] };
        },
        replaceReducer: () => { }
    };
};

const findChildWithClass = (element: Element, c: string): Array<Element> => {
    const foundChildren: Array<Element> = [];

    const children: HTMLCollection = element.children;
    const childList: Array<Element> = [];

    const length: number = children.length;
    let i = 0;
    while (i < length) {
        childList.push(children[i]);
        i++;
    }

    const match: Element | undefined = R.find((child: Element) => child.className === c, childList);

    if (match !== undefined) {
        foundChildren.push(match);
    }
    return foundChildren;
};

export {
    getTestStore
    , findChildWithClass
};
