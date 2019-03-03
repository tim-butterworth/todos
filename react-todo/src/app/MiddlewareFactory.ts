import {
    AnyAction
    , Middleware
    , MiddlewareAPI
    , Dispatch
} from 'redux';

import { MiddlewareFactory } from './AppFactory';
import { AppState, CombinedActions } from './AppState';
import { ID_ACTIONS } from '../todo/add/todoId-state';
import {
    AddAction
    , DeleteAction
    , MoveAction
    , addAction
    , moveAction
    , ToDo
} from '../todo/todo-state';
import { NewToDoCommand, NewToDoCommands } from '../todo/newToDoCommandHandler';
import { MoveCommand, MoveCommands } from '../todo/moveToDoCommandHandler';
import { ADD_TYPES } from '../todo/add/addToDo-state';
import {
    tooFewToDosToMove
    , currentTooSmall
    , currentTooLarge
    , targetTooSmall
    , targetTooLarge
} from '../todo/move/moveToDo-state';

type AppStateMiddleware = Middleware<any, AppState, Dispatch>;
type MiddlewareStore = MiddlewareAPI<Dispatch, AppState>;
type AllActions = CombinedActions<AddAction | DeleteAction | MoveAction | NewToDoCommand | MoveCommand>;

const middleware: AppStateMiddleware = (store: MiddlewareStore) => (next: Dispatch) => (action: AllActions) => {
    if (action.type === NewToDoCommands.NEW_TODO) {
        const id = store.getState().todoId.nextId;
        const todoContent = store.getState().addToDo;
        const actionToAdd: AddAction = addAction({ id, ...todoContent })

        next({ type: ID_ACTIONS.INCREMENT_ID });
        next({ type: ADD_TYPES.RESET })

        return next(actionToAdd);
    } else if (action.type === MoveCommands.MOVE) {
        const todos = store.getState().todos;

        if (todos.length < 2) {
            return next(tooFewToDosToMove());
        }
        if (action.indexes.current < 0) {
            return next(currentTooSmall());
        }
        if (action.indexes.current >= todos.length) {
            return next(currentTooLarge());
        }
        if (action.indexes.target < 0) {
            return next(targetTooSmall());
        }
        if (action.indexes.target >= todos.length) {
            return next(targetTooLarge());
        }

        return next(moveAction(action.indexes));
    } else {
        return next(action);
    }
}

const middlewareFactory: MiddlewareFactory<AppState> = () => middleware;

export {
    middlewareFactory
};
