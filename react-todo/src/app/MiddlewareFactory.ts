import {
    AnyAction
    , Middleware
    , MiddlewareAPI
    , Dispatch
} from 'redux';

import { MiddlewareFactory } from './AppFactory';
import { AppState } from './AppState';
import { ID_ACTIONS } from '../todo/add/todoId-state';
import {
    addAction
    , ToDo
} from '../todo/todo-state';

type AppStateMiddleware = Middleware<any, AppState, Dispatch>;
type MiddlewareStore = MiddlewareAPI<Dispatch, AppState>;

const middleware: AppStateMiddleware = (store: MiddlewareStore) => (next: Dispatch) => (action: AnyAction) => {
    if (action.type === "NEW_TODO") {
        const id = store.getState().todoId.nextId;

        next({ type: ID_ACTIONS.INCREMENT_ID });

        const { todoContent } = action;
        return next(
            addAction({
                id,
                ...todoContent
            })
        );
    } else {
        return next(action);
    }

}

const middlewareFactory: MiddlewareFactory<AppState> = () => middleware;

export {
    middlewareFactory
};
