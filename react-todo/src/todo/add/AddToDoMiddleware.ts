import {
    Store
    , AnyAction
} from 'redux';

import { ToDoIdState } from './todoId-state';

const addToDoMiddleware = (store: Store<ToDoIdState>) => (next: any) => (action: AnyAction) => {
    return next(action);
}

export { addToDoMiddleware };
