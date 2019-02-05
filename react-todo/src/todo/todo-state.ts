import {
    Reducer,
    Action
} from 'redux';
import * as R from 'ramda';

import { CombinedActions } from '../app/AppState';

export interface ToDo {
    description: string;
    title: string;
    id: number;
}

enum TODO_ACTION {
    DELETE = 'DELETE'
}

interface DeleteAction {
    type: TODO_ACTION.DELETE;
    id: number;
}

type ToDoListActions = CombinedActions<DeleteAction>;

const deleteAction = (id: number): DeleteAction => ({
    type: TODO_ACTION.DELETE,
    id
})

const initialTodos: ToDo[] = [
    {
        description: "description",
        title: "title",
        id: 1
    },
    {
        description: "another description",
        title: "another title",
        id: 2
    }
];

const todoList: Reducer<ToDo[]> = (state: ToDo[] = initialTodos, action: ToDoListActions) => {
    console.log("action", action);

    if (action.type === TODO_ACTION.DELETE) {
        return R.filter((todo: ToDo) => todo.id === action.id, state)
    }
    return state;
}

export {
    todoList
};
