import {
    Reducer
    , AnyAction
} from 'redux';

import { CombinedActions } from '../../app/AppState';

interface ToDoId {
    nextId: number;
}
export interface ToDoIdState {
    todoId: ToDoId;
}

export enum ID_ACTIONS {
    INCREMENT_ID = "INCREMENT_ID"
}

interface IncrementAction {
    type: ID_ACTIONS.INCREMENT_ID
}

const initialIdState: ToDoId = {
    nextId: 0
}
const todoId: Reducer<ToDoId> = (
    state: ToDoId = initialIdState,
    action: CombinedActions<IncrementAction>
): ToDoId => {
    if (action.type === ID_ACTIONS.INCREMENT_ID) {
        const nextId = state.nextId + 1;
        return { nextId };
    }
    return state;
}

export {
    todoId
}
